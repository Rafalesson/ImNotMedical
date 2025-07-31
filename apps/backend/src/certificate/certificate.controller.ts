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
  Delete,
  ParseIntPipe
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

  @Get('public/validate/:id')
  validatePublicCertificate(@Param('id', ParseIntPipe) id: number) { 
    return this.certificateService.validateCertificate(id);
  }
  
  @Get('validate/:id')
  @UseGuards(AuthGuard)
  validate(@Param('id', ParseIntPipe) id: number) { 
    return this.certificateService.validateCertificate(id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR')
  create(@Body() createCertificateDto: CreateCertificateDto, @Request() req) {
    const doctorId = parseInt(req.user.id, 10);
    return this.certificateService.create(createCertificateDto, doctorId); 
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
    const doctorId = parseInt(req.user.id, 10);
    return this.certificateService.findAllByDoctor(doctorId);
  }

  @Get('my-certificates')
  @UseGuards(AuthGuard)
  searchMyCertificates(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('patientName') patientName: string,
  ) {
    const doctorId = parseInt(req.user.id, 10);
    return this.certificateService.searchByDoctor(doctorId, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      patientName,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.certificateService.remove(id);
  }

  @Delete('batch/delete')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR')
  removeMany(@Body() batchDeleteDto: BatchDeleteDto) {
    const idsAsNumbers = batchDeleteDto.ids.map(id => parseInt(id, 10));
    return this.certificateService.removeMany(idsAsNumbers);
  }
}