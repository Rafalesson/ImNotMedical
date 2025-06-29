// Endereço: apps/backend/src/certificate/certificate.service.ts (Com filtro de busca corrigido)

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PdfService } from 'src/pdf/pdf.service';
import { TemplatesService } from 'src/templates/templates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { CertificateData } from './certificate.types';
import { calculateAge, numberToWords } from 'src/utils';
import * as fs from 'fs';
import * as path from 'path';
import { Prisma, Sex } from '@prisma/client'; // 1. IMPORTAMOS O TIPO 'Prisma'

@Injectable()
export class CertificateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pdfService: PdfService,
    private readonly templatesService: TemplatesService,
  ) { }

  private async prepareDataForPdf(dto: CreateCertificateDto, doctorId: string, certificateId: string): Promise<CertificateData> {
    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId },
      include: { doctorProfile: { include: { address: true } } },
    });

    const patient = await this.prisma.user.findUnique({
      where: { id: dto.patientId },
      include: { patientProfile: { include: { address: true } } },
    });

    if (!doctor?.doctorProfile || !patient?.patientProfile) {
      throw new NotFoundException('Perfil do médico ou do paciente não encontrado.');
    }

    const doctorAddressObj = doctor.doctorProfile.address;
    const formattedDoctorAddress = doctorAddressObj
      ? `${doctorAddressObj.street}, ${doctorAddressObj.number} - ${doctorAddressObj.city}, ${doctorAddressObj.state}`
      : 'Endereço não informado';

    const cid = dto.cidCode ? await this.prisma.cidCode.findUnique({ where: { code: dto.cidCode } }) : null;
    const issueDate = new Date();
    const formattedDateTime = issueDate.toLocaleString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) + ' às ' + issueDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return {
      doctorName: doctor.doctorProfile.name,
      doctorCrm: doctor.doctorProfile.crm,
      doctorSpecialty: doctor.doctorProfile.specialty,
      doctorAddress: formattedDoctorAddress,
      doctorPhone: doctor.doctorProfile.phone,
      patientName: patient.patientProfile.name,
      patientCpf: patient.patientProfile.cpf,
      patientAge: calculateAge(patient.patientProfile.dateOfBirth).toString(),
      patientSex: patient.patientProfile.sex === Sex.MALE ? 'Masculino' : patient.patientProfile.sex === Sex.FEMALE ? 'Feminino' : 'Não informado',
      durationInDays: dto.durationInDays || 0,
      durationInWords: numberToWords(dto.durationInDays || 0),
      startDate: dto.startDate ? new Date(dto.startDate).toLocaleDateString('pt-BR') : issueDate.toLocaleDateString('pt-BR'),
      purpose: dto.purpose,
      cidCode: dto.cidCode,
      cidDescription: cid?.description,
      issueDateTime: formattedDateTime,
      certificateId: certificateId,
    };
  }

  async generateCertificatePdf(dto: CreateCertificateDto, doctorId: string): Promise<Buffer> {
    const data = await this.prepareDataForPdf(dto, doctorId, 'PREVIEW-ID');
    const html = this.templatesService.getPopulatedCertificateHtml(data, dto.templateId);
    return this.pdfService.generatePdfFromHtml(html);
  }

  async create(createCertificateDto: CreateCertificateDto, doctorId: string) {
    const certificateRecord = await this.prisma.medicalCertificate.create({
      data: {
        purpose: createCertificateDto.purpose,
        startDate: createCertificateDto.startDate,
        durationInDays: createCertificateDto.durationInDays,
        cidCode: createCertificateDto.cidCode,
        observations: createCertificateDto.observations,
        templateId: createCertificateDto.templateId || 'default',
        doctor: { connect: { id: doctorId } },
        patient: { connect: { id: createCertificateDto.patientId } }
      },
    });

    const data = await this.prepareDataForPdf(createCertificateDto, doctorId, certificateRecord.id);
    const html = this.templatesService.getPopulatedCertificateHtml(data, createCertificateDto.templateId);
    const pdfBuffer = await this.pdfService.generatePdfFromHtml(html);

    const pdfDir = path.join(process.cwd(), 'storage', 'certificates');
    if (!fs.existsSync(pdfDir)) { fs.mkdirSync(pdfDir, { recursive: true }); }

    const pdfFileName = `${certificateRecord.id}.pdf`;
    const pdfPath = path.join(pdfDir, pdfFileName);
    fs.writeFileSync(pdfPath, pdfBuffer);

    return await this.prisma.medicalCertificate.update({
      where: { id: certificateRecord.id },
      data: { pdfUrl: `/storage/certificates/${pdfFileName}` },
    });
  }

  findAllByDoctor(doctorId: string) {
    return this.prisma.medicalCertificate.findMany({
      where: { doctorId: doctorId },
      orderBy: { issueDate: 'desc' },
      include: {
        patient: {
          include: {
            patientProfile: true
          }
        }
      },
      take: 5,
    });
  }

  async validateCertificate(id: string) {
    const certificate = await this.prisma.medicalCertificate.findUnique({
      where: { id },
      include: {
        doctor: { include: { doctorProfile: true } },
        patient: { include: { patientProfile: true } },
      },
    });
    if (!certificate) { throw new NotFoundException('Atestado não encontrado.'); }
    return {
      issuedAt: certificate.issueDate,
      durationInDays: certificate.durationInDays,
      doctorName: certificate.doctor.doctorProfile?.name,
      doctorCrm: certificate.doctor.doctorProfile?.crm,
      patientName: certificate.patient.patientProfile?.name.split(' ').map((word, index) => (index === 0 ? word : `${word.charAt(0)}.`)).join(' ') || '',
    };
  }

  async searchByDoctor(
    doctorId: string,
    options: { page?: number; limit?: number; patientName?: string },
  ) {
    const { page = 1, limit = 10, patientName } = options;
    const skip = (page - 1) * limit;

    // 2. A 'whereClause' agora é construída de forma segura para o TypeScript
    const whereClause: Prisma.MedicalCertificateWhereInput = {
      doctorId: doctorId,
    };

    if (patientName) {
      whereClause.patient = {
        patientProfile: {
          name: {
            contains: patientName,
            mode: 'insensitive',
          },
        },
      };
    }

    const [certificates, total] = await this.prisma.$transaction([
      this.prisma.medicalCertificate.findMany({
        where: whereClause,
        include: {
          patient: {
            select: {
              patientProfile: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          issueDate: 'desc',
        },
        take: limit,
        skip: skip,
      }),
      this.prisma.medicalCertificate.count({
        where: whereClause,
      }),
    ]);

    return {
      data: certificates,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async remove(id: string): Promise<{ message: string }> {
    // Primeiro, encontramos o registro para pegar o caminho do PDF
    const certificate = await this.prisma.medicalCertificate.findUnique({
      where: { id },
    });

    if (!certificate) {
      throw new NotFoundException(`Atestado com ID ${id} não encontrado.`);
    }

    // Se houver um arquivo PDF associado, vamos deletá-lo
    if (certificate.pdfUrl) {
      // O caminho é relativo a partir da pasta 'storage'
      const filePath = path.join(process.cwd(), certificate.pdfUrl);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Deleta o arquivo físico
        }
      } catch (error) {
        // Logamos o erro mas continuamos, pois o principal é deletar o registro do banco
        console.error(`Falha ao deletar o arquivo físico: ${filePath}`, error);
      }
    }

    // Finalmente, deletamos o registro do banco de dados
    await this.prisma.medicalCertificate.delete({
      where: { id },
    });

    return { message: 'Atestado deletado com sucesso.' };
  }

  async removeMany(ids: string[]): Promise<{ message: string; count: number }> {
    // Encontra todos os registros para pegar os caminhos dos PDFs
    const certificatesToDelete = await this.prisma.medicalCertificate.findMany({
      where: {
        id: { in: ids },
      },
    });

    if (certificatesToDelete.length === 0) {
      throw new NotFoundException('Nenhum atestado encontrado para os IDs fornecidos.');
    }

    // Deleta os arquivos físicos
    for (const certificate of certificatesToDelete) {
      if (certificate.pdfUrl) {
        const filePath = path.join(process.cwd(), certificate.pdfUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // Deleta todos os registros do banco de uma vez
    const { count } = await this.prisma.medicalCertificate.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return { message: `${count} atestado(s) deletado(s) com sucesso.`, count };
  }
}