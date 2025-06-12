// src/certificate/certificate.service.ts
import { Injectable } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { PrismaService } from 'src/prisma/prisma.service'; // <-- A IMPORTAÇÃO QUE FALTAVA

@Injectable()
export class CertificateService {
  constructor(private prisma: PrismaService) {} // Agora ele conhece o PrismaService

  // Deixando o método `create` como estava, pois ele está correto
  create(createCertificateDto: CreateCertificateDto, doctorId: string) {
    return this.prisma.medicalCertificate.create({
      data: {
        ...createCertificateDto,
        doctorId: doctorId,
      },
    });
  }
}