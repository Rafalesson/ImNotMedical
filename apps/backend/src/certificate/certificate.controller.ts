// Endereço: apps/backend/src/certificate/certificate.controller.ts (Versão Final e Organizada)
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

  @Get('validate/:id')
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

  // --- ROTA DEDICADA PARA O WIDGET DE ATESTADOS RECENTES ---
  @Get('recent')
  @UseGuards(AuthGuard)
  @Roles('DOCTOR')
  findRecent(@Request() req) {
    return this.certificateService.findAllByDoctor(req.user.id);
  }

  // Rota para a página de histórico com busca e paginação
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