// Endereço: apps/backend/src/certificate/certificate.controller.ts

import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Request, 
  Get, 
  Param,
  Query,
  Delete
} from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { BatchDeleteDto } from './dto/batch-delete.dto';

@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  // --- ROTA PÚBLICA PARA VALIDAÇÃO VIA QR CODE ---
  // Este endpoint é público e não requer autenticação.
  @Get('public/validate/:id')
  validatePublicCertificate(@Param('id') id: string) {
    // Reutiliza o método de serviço que já retorna dados seguros.
    return this.certificateService.validateCertificate(id);
  }
  
  // Rota antiga, mantida para possíveis usos internos autenticados.
  @Get('validate/:id')
  @UseGuards(AuthGuard)
  validate(@Param('id') id: string) {
    return this.certificateService.validateCertificate(id);
  }

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

  @Get('recent')
  @UseGuards(AuthGuard)
  @Roles('DOCTOR')
  findRecent(@Request() req) {
    return this.certificateService.findAllByDoctor(req.user.id);
  }

  @Get('my-certificates')
  @UseGuards(AuthGuard)
  searchMyCertificates(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('patientName') patientName: string,
  ) {
    return this.certificateService.searchByDoctor(req.user.id, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      patientName,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR')
  remove(@Param('id') id: string) {
    return this.certificateService.remove(id);
  }

  @Delete('batch/delete')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR')
  removeMany(@Body() batchDeleteDto: BatchDeleteDto) {
    return this.certificateService.removeMany(batchDeleteDto.ids);
  }
}