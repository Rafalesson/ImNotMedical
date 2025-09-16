import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PdfService } from 'src/pdf/pdf.service';
import { TemplatesService } from 'src/templates/templates.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { CertificateData } from './certificate.types';
import { calculateAge, numberToWords } from 'src/utils';
import * as fs from 'fs';
import * as path from 'path';
import { Prisma, Sex } from '@prisma/client';

type UserWithProfiles = Prisma.UserGetPayload<{
  include: {
    doctorProfile: { include: { address: true } };
    patientProfile: true;
  };
}>;

@Injectable()
export class CertificateService {
  private readonly logger = new Logger(CertificateService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly pdfService: PdfService,
    private readonly templatesService: TemplatesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private async prepareDataForPdf(
    dto: CreateCertificateDto,
    doctorId: number,
    certificateId: number,
  ): Promise<CertificateData> {
    const patientId = dto.patientId ?? 0;

    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId },
      include: { doctorProfile: { include: { address: true } } },
    });

    const patient = await this.prisma.user.findUnique({
      where: { id: patientId },
      include: { patientProfile: true },
    });

    if (!doctor?.doctorProfile || !patient?.patientProfile) {
      throw new NotFoundException(
        'Perfil do medico ou do paciente nao encontrado.',
      );
    }

    const doctorAddressObj = doctor.doctorProfile.address;
    const formattedDoctorAddress = doctorAddressObj
      ? `${doctorAddressObj.street}, ${doctorAddressObj.number} - ${doctorAddressObj.city}, ${doctorAddressObj.state}`
      : 'Endereco nao informado';

    const cid = dto.cidCode
      ? await this.prisma.cidCode.findUnique({ where: { code: dto.cidCode } })
      : null;
    const issueDate = new Date();
    const formattedDateTime =
      issueDate.toLocaleString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }) +
      ' as ' +
      issueDate.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

    return {
      doctorName: doctor.doctorProfile.name,
      doctorCrm: doctor.doctorProfile.crm,
      doctorSpecialty: doctor.doctorProfile.specialty,
      doctorAddress: formattedDoctorAddress,
      doctorPhone: doctor.doctorProfile.phone,
      patientName: patient.patientProfile.name,
      patientCpf: patient.patientProfile.cpf,
      patientAge: calculateAge(
        new Date(patient.patientProfile.dateOfBirth),
      ).toString(),
      patientSex:
        patient.patientProfile.sex === Sex.MALE
          ? 'Masculino'
          : patient.patientProfile.sex === Sex.FEMALE
            ? 'Feminino'
            : 'Nao informado',
      durationInDays: dto.durationInDays || 0,
      durationInWords: numberToWords(dto.durationInDays || 0),
      startDate: dto.startDate
        ? new Date(dto.startDate).toLocaleDateString('pt-BR')
        : issueDate.toLocaleDateString('pt-BR'),
      purpose: dto.purpose,
      cidCode: dto.cidCode,
      cidDescription: cid?.description,
      issueDateTime: formattedDateTime,
      certificateId: certificateId.toString(),
    };
  }

  async generateCertificatePdf(
    dto: CreateCertificateDto,
    doctorId: number,
  ): Promise<Buffer> {
    const data = await this.prepareDataForPdf(dto, doctorId, 0);
    const html = await this.templatesService.getPopulatedCertificateHtml(
      data,
      dto.templateId,
    );
    return this.pdfService.generatePdfFromHtml(html);
  }

  async create(createCertificateDto: CreateCertificateDto, doctorId: number) {
    const certificateRecord = await this.prisma.medicalCertificate.create({
      data: {
        purpose: createCertificateDto.purpose,
        startDate: createCertificateDto.startDate,
        durationInDays: createCertificateDto.durationInDays,
        cidCode: createCertificateDto.cidCode,
        observations: createCertificateDto.observations,
        templateId: createCertificateDto.templateId || 'default',
        doctor: { connect: { id: doctorId } },
        patient: {
          connect: { id: createCertificateDto.patientId },
        },
      },
    });

    const data = await this.prepareDataForPdf(
      createCertificateDto,
      doctorId,
      certificateRecord.id,
    );
    const html = await this.templatesService.getPopulatedCertificateHtml(
      data,
      createCertificateDto.templateId,
    );
    const pdfBuffer = await this.pdfService.generatePdfFromHtml(html);

    // Armazena o PDF gerado na Cloudinary quando as credenciais estao configuradas.
    if (this.cloudinaryService.isEnabled()) {
      try {
        const uploadResult = await this.cloudinaryService.uploadCertificatePdf(
          pdfBuffer,
          certificateRecord.id.toString(),
        );

        return this.prisma.medicalCertificate.update({
          where: { id: certificateRecord.id },
          data: { pdfUrl: uploadResult.secure_url },
        });
      } catch (error) {
        this.logger.error('Falha ao enviar PDF para a Cloudinary:', error);
      }
    }

    // Fallback para a pasta local quando a Cloudinary estiver desativada.
    const pdfDir = path.join(process.cwd(), 'storage', 'certificates');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const pdfFileName = `${certificateRecord.id}.pdf`;
    const pdfPath = path.join(pdfDir, pdfFileName);
    fs.writeFileSync(pdfPath, pdfBuffer);

    return this.prisma.medicalCertificate.update({
      where: { id: certificateRecord.id },
      data: { pdfUrl: `/storage/certificates/${pdfFileName}` },
    });
  }

  findAllByDoctor(doctorId: number) {
    return this.prisma.medicalCertificate.findMany({
      where: { doctorId: doctorId },
      orderBy: { issueDate: 'desc' },
      include: {
        patient: { include: { patientProfile: true } },
      },
      take: 5,
    });
  }

  async validateCertificate(id: number) {
    const certificate = await this.prisma.medicalCertificate.findUnique({
      where: { id },
      include: {
        doctor: { include: { doctorProfile: true } },
        patient: { include: { patientProfile: true } },
      },
    });
    if (!certificate) {
      throw new NotFoundException('Atestado nao encontrado.');
    }
    return {
      issuedAt: certificate.issueDate,
      durationInDays: certificate.durationInDays,
      doctorName: certificate.doctor.doctorProfile?.name,
      doctorCrm: certificate.doctor.doctorProfile?.crm,
      patientName:
        certificate.patient.patientProfile?.name
          .split(' ')
          .map((word, index) => (index === 0 ? word : `${word.charAt(0)}.`))
          .join(' ') || '',
    };
  }

  async searchByDoctor(
    doctorId: number,
    options: { page?: number; limit?: number; patientName?: string },
  ) {
    const { page = 1, limit = 10, patientName } = options;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.MedicalCertificateWhereInput = {
      doctorId: doctorId,
    };

    if (patientName) {
      whereClause.patient = {
        patientProfile: {
          name: { contains: patientName, mode: 'insensitive' },
        },
      };
    }

    const [certificates, total] = await this.prisma.$transaction([
      this.prisma.medicalCertificate.findMany({
        where: whereClause,
        include: {
          patient: { select: { patientProfile: { select: { name: true } } } },
        },
        orderBy: { issueDate: 'desc' },
        take: limit,
        skip: skip,
      }),
      this.prisma.medicalCertificate.count({ where: whereClause }),
    ]);

    return {
      data: certificates,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const certificate = await this.prisma.medicalCertificate.findUnique({
      where: { id },
    });

    if (!certificate) {
      throw new NotFoundException(`Atestado com ID ${id} nao encontrado.`);
    }

    if (certificate.pdfUrl) {
      if (this.cloudinaryService.isEnabled()) {
        // Mantem os fluxos de exclusao remota/local sincronizados de acordo com o storage ativo.
        try {
          await this.cloudinaryService.deleteCertificatePdfByUrl(
            certificate.pdfUrl,
          );
        } catch (error) {
          console.error(
            `Falha ao deletar o arquivo no Cloudinary: ${certificate.pdfUrl}`,
            error,
          );
        }
      } else {
        const filePath = path.join(process.cwd(), certificate.pdfUrl);
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (error) {
          console.error(
            `Falha ao deletar o arquivo fisico: ${filePath}`,
            error,
          );
        }
      }
    }

    await this.prisma.medicalCertificate.delete({
      where: { id },
    });

    return { message: 'Atestado deletado com sucesso.' };
  }

  async removeMany(ids: number[]): Promise<{ message: string; count: number }> {
    const certificatesToDelete = await this.prisma.medicalCertificate.findMany({
      where: { id: { in: ids } },
    });

    if (certificatesToDelete.length === 0) {
      throw new NotFoundException(
        'Nenhum atestado encontrado para os IDs fornecidos.',
      );
    }

    for (const certificate of certificatesToDelete) {
      if (certificate.pdfUrl) {
        if (this.cloudinaryService.isEnabled()) {
          // Mantem os fluxos de exclusao remota/local sincronizados de acordo com o storage ativo.
          try {
            await this.cloudinaryService.deleteCertificatePdfByUrl(
              certificate.pdfUrl,
            );
          } catch (error) {
            console.error(
              `Falha ao deletar o arquivo no Cloudinary: ${certificate.pdfUrl}`,
              error,
            );
          }
        } else {
          const filePath = path.join(process.cwd(), certificate.pdfUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }
    }

    const { count } = await this.prisma.medicalCertificate.deleteMany({
      where: { id: { in: ids } },
    });

    return { message: `${count} atestado(s) deletado(s) com sucesso.`, count };
  }
}


