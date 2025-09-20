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
  ParseIntPipe,
} from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { BatchDeleteDto } from './dto/batch-delete.dto';

// Tipo auxiliar para representar a Request com o usuario autenticado.
type AuthenticatedRequest = {
  user: {
    id: string;
  };
};

@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Get('public/validate/:code')
  validatePublicCertificate(@Param('code') code: string) {
    return this.certificateService.validateCertificate(code);
  }

  @Get('validate/:code')
  @UseGuards(AuthGuard)
  validate(@Param('code') code: string) {
    return this.certificateService.validateCertificate(code);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR')
  create(
    @Body() createCertificateDto: CreateCertificateDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const doctorId = Number.parseInt(req.user.id, 10);
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
  findRecent(@Request() req: AuthenticatedRequest) {
    const doctorId = Number.parseInt(req.user.id, 10);
    return this.certificateService.findAllByDoctor(doctorId);
  }

  @Get('my-certificates')
  @UseGuards(AuthGuard)
  searchMyCertificates(
    @Request() req: AuthenticatedRequest,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('patientName') patientName: string,
  ) {
    const doctorId = Number.parseInt(req.user.id, 10);
    return this.certificateService.searchByDoctor(doctorId, {
      page: Number.parseInt(page, 10),
      limit: Number.parseInt(limit, 10),
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
    const idsAsNumbers = batchDeleteDto.ids.map((id) =>
      Number.parseInt(id, 10),
    );
    return this.certificateService.removeMany(idsAsNumbers);
  }
}


