// src/certificate/certificate.controller.ts

// ADICIONAMOS TODAS AS IMPORTAÇÕES NECESSÁRIAS AQUI EM CIMA
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('certificates') 
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR')
  create(@Body() createCertificateDto: CreateCertificateDto, @Request() req) {
    const doctorId = req.user.userId;
    return this.certificateService.create(createCertificateDto, doctorId);
  }
}