import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PdfService } from 'src/pdf/pdf.service';
import { TemplatesService } from 'src/templates/templates.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { PrescriptionData } from './prescription.types';
import { calculateAge } from 'src/utils';
import { Prisma, Sex } from '@prisma/client';
import { randomBytes } from 'crypto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PrescriptionService {
  private readonly logger = new Logger(PrescriptionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pdfService: PdfService,
    private readonly templatesService: TemplatesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private createRandomCode(
    length = 8,
    alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ',
  ): string {
    const bytes = randomBytes(length);
    let code = '';

    for (let i = 0; i < bytes.length; i++) {
      code += alphabet[bytes[i] % alphabet.length];
    }

    return code;
  }

  private async generateUniquePrescriptionCode(): Promise<string> {
    const maxAttempts = 5;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const code = this.createRandomCode();
      const existing = await this.prisma.medicalPrescription.findUnique({
        where: { code },
        select: { id: true },
      });

      if (!existing) {
        return code;
      }
    }

    return `${this.createRandomCode(10)}${Date.now().toString(36).toUpperCase()}`.slice(
      0,
      14,
    );
  }

  private formatIssueDateTime(date: Date): string {
    try {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };

      const formatter = new Intl.DateTimeFormat('pt-BR', options);
      const parts = formatter.formatToParts(date);
      const getPart = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((part) => part.type === type)?.value ?? '';

      const day = getPart('day');
      const month = getPart('month');
      const year = getPart('year');
      const hour = getPart('hour');
      const minute = getPart('minute');
      const second = getPart('second');

      if (day && month && year && hour && minute && second) {
        return `${day}/${month}/${year} - ${hour}:${minute}:${second} (GMT-03)`;
      }
    } catch (error) {
      // Se ocorrer algum problema com Intl, cai no fallback abaixo
      this.logger.warn(
        `Falha ao formatar data no fuso de São Paulo: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    // Fallback simples caso Intl falhe por algum motivo inesperado
    const datePart = date.toLocaleDateString('pt-BR');
    const timePart = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return `${datePart} - ${timePart} (GMT-03)`;
  }

  private async prepareDataForPdf(
    dto: CreatePrescriptionDto,
    doctorId: number,
    prescriptionCode: string,
    pharmacyToken: string,
    patientToken: string,
  ): Promise<PrescriptionData> {
    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId },
      include: { doctorProfile: { include: { address: true } } },
    });

    const patient = await this.prisma.user.findUnique({
      where: { id: dto.patientId },
      include: { patientProfile: true },
    });

    if (!doctor?.doctorProfile || !patient?.patientProfile) {
      throw new NotFoundException(
        'Perfil do médico ou do paciente não encontrado.',
      );
    }

    const doctorAddress = doctor.doctorProfile.address
      ? `${doctor.doctorProfile.address.street}, ${doctor.doctorProfile.address.number} - ${doctor.doctorProfile.address.city}/${doctor.doctorProfile.address.state}`
      : 'Endereço não informado';

    const patientAge = (
      patient.patientProfile.dateOfBirth
        ? calculateAge(new Date(patient.patientProfile.dateOfBirth)).toString()
        : null
    );

    const patientSex = (function () {
      switch (patient.patientProfile.sex) {
        case Sex.MALE:
          return 'Masculino';
        case Sex.FEMALE:
          return 'Feminino';
        default:
          return 'Não informado';
      }
    })();

    const issueDate = new Date();

    return {
      doctorName: doctor.doctorProfile.name,
      doctorCrm: doctor.doctorProfile.crm,
      doctorSpecialty: doctor.doctorProfile.specialty,
      doctorAddress,
      doctorPhone: doctor.doctorProfile.phone,
      patientName: patient.patientProfile.name,
      patientCpf: patient.patientProfile.cpf,
      patientAge: patientAge,
      patientSex: patientSex,
      issueDateTime: this.formatIssueDateTime(issueDate),
      items: dto.items.map((item) => ({
        title: item.title,
        description: item.description ?? '',
        observation: item.observation ?? '',
      })),
      generalGuidance: dto.generalGuidance,
      additionalNotes: dto.additionalNotes,
      prescriptionCode,
      pharmacyToken,
      patientToken,
    };
  }

  async create(createPrescriptionDto: CreatePrescriptionDto, doctorId: number) {
    const code = await this.generateUniquePrescriptionCode();
    const pharmacyToken = this.createRandomCode(6);
    const patientToken = this.createRandomCode(4, '0123456789');

    const prescriptionRecord = await this.prisma.medicalPrescription.create({
      data: {
        code,
        templateId: createPrescriptionDto.templateId ?? 'default',
        items: createPrescriptionDto.items.map((item) => ({
          title: item.title,
          description: item.description ?? '',
          observation: item.observation ?? '',
        })),
        generalGuidance: createPrescriptionDto.generalGuidance,
        additionalNotes: createPrescriptionDto.additionalNotes,
        pharmacyToken,
        patientToken,
        doctor: { connect: { id: doctorId } },
        patient: { connect: { id: createPrescriptionDto.patientId } },
      },
    });

    const data = await this.prepareDataForPdf(
      createPrescriptionDto,
      doctorId,
      prescriptionRecord.code,
      pharmacyToken,
      patientToken,
    );

    const html = await this.templatesService.getPopulatedPrescriptionHtml(
      data,
      createPrescriptionDto.templateId,
    );
    const pdfBuffer = await this.pdfService.generatePdfFromHtml(html);

    if (this.cloudinaryService.isEnabled()) {
      try {
        const uploadResult = await this.cloudinaryService.uploadPrescriptionPdf(
          pdfBuffer,
          prescriptionRecord.id.toString(),
        );

        return this.prisma.medicalPrescription.update({
          where: { id: prescriptionRecord.id },
          data: { pdfUrl: uploadResult.secure_url },
        });
      } catch (error) {
        this.logger.error(
          'Falha ao enviar PDF de receita para a Cloudinary:',
          error,
        );
      }
    }

    const pdfDir = path.join(process.cwd(), 'storage', 'prescriptions');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const pdfFileName = `${prescriptionRecord.id}.pdf`;
    const pdfPath = path.join(pdfDir, pdfFileName);
    fs.writeFileSync(pdfPath, pdfBuffer);

    return this.prisma.medicalPrescription.update({
      where: { id: prescriptionRecord.id },
      data: { pdfUrl: `/storage/prescriptions/${pdfFileName}` },
    });
  }

  findAllByDoctor(doctorId: number) {
    return this.prisma.medicalPrescription.findMany({
      where: { doctorId },
      orderBy: { issueDate: 'desc' },
      include: {
        patient: { include: { patientProfile: true } },
      },
      take: 5,
    });
  }

  async searchByDoctor(
    doctorId: number,
    options: { page?: number; limit?: number; patientName?: string },
  ) {
    const { page = 1, limit = 10, patientName } = options;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.MedicalPrescriptionWhereInput = {
      doctorId,
    };

    if (patientName) {
      whereClause.patient = {
        patientProfile: {
          name: { contains: patientName, mode: 'insensitive' },
        },
      };
    }

    const [prescriptions, total] = await this.prisma.$transaction([
      this.prisma.medicalPrescription.findMany({
        where: whereClause,
        include: {
          patient: { select: { patientProfile: { select: { name: true } } } },
        },
        orderBy: { issueDate: 'desc' },
        take: limit,
        skip,
      }),
      this.prisma.medicalPrescription.count({ where: whereClause }),
    ]);

    return {
      data: prescriptions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async validatePrescription(identifier: string) {
    const cleaned = identifier.trim();
    const codeIdentifier = cleaned.toUpperCase();

    const include = {
      doctor: { include: { doctorProfile: true } },
      patient: { include: { patientProfile: true } },
    };

    let prescription = await this.prisma.medicalPrescription.findUnique({
      where: { code: codeIdentifier },
      include,
    });

    if (!prescription && /^\d+$/.test(cleaned)) {
      prescription = await this.prisma.medicalPrescription.findUnique({
        where: { id: Number.parseInt(cleaned, 10) },
        include,
      });
    }

    if (!prescription) {
      throw new NotFoundException('Receita não encontrada.');
    }

    return {
      issuedAt: prescription.issueDate,
      doctorName: prescription.doctor.doctorProfile?.name,
      doctorCrm: prescription.doctor.doctorProfile?.crm,
      patientName:
        prescription.patient.patientProfile?.name?.trim() || '',
      pharmacyToken: prescription.pharmacyToken,
      patientToken: prescription.patientToken,
      pdfUrl: prescription.pdfUrl ?? null,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const prescription = await this.prisma.medicalPrescription.findUnique({
      where: { id },
    });

    if (!prescription) {
      throw new NotFoundException(`Receita com ID ${id} não encontrada.`);
    }

    if (prescription.pdfUrl) {
      if (
        this.cloudinaryService.isEnabled() &&
        prescription.pdfUrl.startsWith('http')
      ) {
        try {
          await this.cloudinaryService.deletePrescriptionPdfByUrl(
            prescription.pdfUrl,
          );
        } catch (error) {
          this.logger.error(
            `Falha ao deletar arquivo da Cloudinary: ${prescription.pdfUrl}`,
            error,
          );
        }
      } else {
        const filePath = path.join(process.cwd(), prescription.pdfUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await this.prisma.medicalPrescription.delete({ where: { id } });

    return { message: 'Receita deletada com sucesso.' };
  }

  async removeMany(ids: number[]): Promise<{ message: string; count: number }> {
    const prescriptions = await this.prisma.medicalPrescription.findMany({
      where: { id: { in: ids } },
    });

    if (prescriptions.length === 0) {
      throw new NotFoundException(
        'Nenhuma receita encontrada para os IDs fornecidos.',
      );
    }

    for (const prescription of prescriptions) {
      if (prescription.pdfUrl) {
        if (
          this.cloudinaryService.isEnabled() &&
          prescription.pdfUrl.startsWith('http')
        ) {
          try {
            await this.cloudinaryService.deletePrescriptionPdfByUrl(
              prescription.pdfUrl,
            );
          } catch (error) {
            this.logger.error(
              `Falha ao deletar arquivo da Cloudinary: ${prescription.pdfUrl}`,
              error,
            );
          }
        } else {
          const filePath = path.join(process.cwd(), prescription.pdfUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }
    }

    const { count } = await this.prisma.medicalPrescription.deleteMany({
      where: { id: { in: ids } },
    });

    return {
      message: `${count} receita(s) deletada(s) com sucesso.`,
      count,
    };
  }
}

