// Endereço: apps/backend/src/certificate/certificate.controller.ts (Versão Corrigida)

import { Controller, Post, Body, UseGuards, Request, Get, Res, Param, Header, InternalServerErrorException } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Response } from 'express';

@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Get('validate/:id')
  validate(@Param('id') id: string) {
    return this.certificateService.validateCertificate(id);
  }

  // Rota para criar o atestado final
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR')
  create(@Body() createCertificateDto: CreateCertificateDto, @Request() req) {
    return this.certificateService.create(createCertificateDto, req.user.id); 
  }

  @Post('preview')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR')
  pingPreview() {
    return { status: 'ok', message: 'Preview is handled by the client.' };
  }

  @Get('my-certificates')
  @UseGuards(AuthGuard)
  findAllByDoctor(@Request() req) {
    return this.certificateService.findAllByDoctor(req.user.id);
  }
}