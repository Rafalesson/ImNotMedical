// src/certificate/certificate.controller.ts (com rota de validação)
import { Controller, Post, Body, UseGuards, Request, Get, Res, Param, NotFoundException } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Response } from 'express';

@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  // --- ROTA PÚBLICA DE VALIDAÇÃO ---
  @Get('validate/:id')
  validate(@Param('id') id: string) {
    return this.certificateService.validateCertificate(id);
  }

  // --- ROTAS PRIVADAS ---
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR')
  create(@Body() createCertificateDto: CreateCertificateDto, @Request() req) {
    return this.certificateService.create(createCertificateDto, req.user.userId);
  }

  @Post('preview')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR')
  async generatePreview(@Body() createCertificateDto: CreateCertificateDto, @Request() req, @Res() res: Response) {
    const pdfBuffer = await this.certificateService.generateCertificatePdf(
      createCertificateDto,
      req.user.userId,
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  }

  @Get('my-certificates')
  @UseGuards(AuthGuard)
  findAllByDoctor(@Request() req) {
    return this.certificateService.findAllByDoctor(req.user.userId);
  }
}