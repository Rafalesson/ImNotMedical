// Endereço: apps/backend/src/certificate/certificate.service.ts (versão corrigida)

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PdfService } from 'src/pdf/pdf.service';
import { TemplatesService } from 'src/templates/templates.service';
import { CertificateData } from './certificate.types';
import { calculateAge, numberToWords } from 'src/utils';
import * as fs from 'fs';
import * as path from 'path';
import { Sex } from '@prisma/client';

@Injectable()
export class CertificateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pdfService: PdfService,
    private readonly templatesService: TemplatesService,
  ) {}

  private async prepareDataForPdf(dto: CreateCertificateDto, doctorId: string, certificateId: string): Promise<CertificateData> {
    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId },
      include: { doctorProfile: { include: { address: true } } },
    });
    
    // MUDANÇA AQUI: Adicionamos a inclusão do endereço do paciente
    const patient = await this.prisma.user.findUnique({
      where: { id: dto.patientId },
      include: { patientProfile: { include: { address: true } } },
    });

    if (!doctor?.doctorProfile || !patient?.patientProfile) {
      throw new NotFoundException('Perfil do médico ou do paciente não encontrado.');
    }
    
    const doctorAddressObj = doctor.doctorProfile.address;
    const formattedDoctorAddress = doctorAddressObj
      ? `${doctorAddressObj.street}, ${doctorAddressObj.number} - ${doctorAddressObj.neighborhood}, ${doctorAddressObj.city} - ${doctorAddressObj.state}`
      : 'Endereço não informado';

    let cidDescription = dto.cidCode ? (await this.prisma.cidCode.findUnique({ where: { code: dto.cidCode } }))?.description : null;
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
      cidDescription: cidDescription,
      issueDateTime: formattedDateTime,
      certificateId: certificateId,
    };
  }

  // O resto do serviço não precisa de mudanças...
  async generateCertificatePdf(dto: CreateCertificateDto, doctorId: string): Promise<Buffer> {
    const data = await this.prepareDataForPdf(dto, doctorId, 'PREVIEW-ID');
    const html = this.templatesService.getPopulatedCertificateHtml(data);
    return this.pdfService.generatePdfFromHtml(html);
  }

  async create(createCertificateDto: CreateCertificateDto, doctorId: string) {
    const certificateRecord = await this.prisma.medicalCertificate.create({ data: { ...createCertificateDto, doctorId } });
    const data = await this.prepareDataForPdf(createCertificateDto, doctorId, certificateRecord.id);
    const html = this.templatesService.getPopulatedCertificateHtml(data);
    const pdfBuffer = await this.pdfService.generatePdfFromHtml(html);
    const pdfDir = path.join(process.cwd(), 'storage', 'certificates');
    if (!fs.existsSync(pdfDir)) { fs.mkdirSync(pdfDir, { recursive: true }); }
    const pdfPath = path.join(pdfDir, `${certificateRecord.id}.pdf`);
    fs.writeFileSync(pdfPath, pdfBuffer);
    return await this.prisma.medicalCertificate.update({
      where: { id: certificateRecord.id },
      data: { pdfUrl: `/storage/certificates/${certificateRecord.id}.pdf` },
    });
  }

  findAllByDoctor(doctorId: string) {
    return this.prisma.medicalCertificate.findMany({
      where: { doctorId },
      orderBy: { issueDate: 'desc' },
      include: { patient: { include: { patientProfile: true } } },
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
}