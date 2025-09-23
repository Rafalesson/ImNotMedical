import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { BatchDeleteDto } from './dto/batch-delete.dto';

type AuthenticatedRequest = {
  user: {
    id: string;
  };
};

@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Get('public/validate/:code')
  validatePublic(@Param('code') code: string) {
    return this.prescriptionService.validatePrescription(code);
  }

  @Get('validate/:code')
  @UseGuards(AuthGuard)
  validate(@Param('code') code: string) {
    return this.prescriptionService.validatePrescription(code);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR')
  create(
    @Body() createPrescriptionDto: CreatePrescriptionDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const doctorId = Number.parseInt(req.user.id, 10);
    return this.prescriptionService.create(createPrescriptionDto, doctorId);
  }

  @Post('preview')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR')
  previewPing() {
    return { status: 'ok', message: 'Preview handled on client side.' };
  }

  @Get('recent')
  @UseGuards(AuthGuard)
  @Roles('DOCTOR')
  findRecent(@Request() req: AuthenticatedRequest) {
    const doctorId = Number.parseInt(req.user.id, 10);
    return this.prescriptionService.findAllByDoctor(doctorId);
  }

  @Get('my-prescriptions')
  @UseGuards(AuthGuard)
  @Roles('DOCTOR')
  searchMyPrescriptions(
    @Request() req: AuthenticatedRequest,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('patientName') patientName?: string,
  ) {
    const doctorId = Number.parseInt(req.user.id, 10);
    return this.prescriptionService.searchByDoctor(doctorId, {
      page: Number.parseInt(page, 10),
      limit: Number.parseInt(limit, 10),
      patientName,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptionService.remove(id);
  }

  @Delete('batch/delete')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR')
  removeMany(@Body() batchDeleteDto: BatchDeleteDto) {
    const ids = batchDeleteDto.ids.map((id) => Number.parseInt(id, 10));
    return this.prescriptionService.removeMany(ids);
  }
}
