// Endereço: apps/backend/src/patient/patient.controller.ts (versão corrigida)

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get('search')
  search(@Query('name') query: string) {
    return this.patientService.search(query);
  }

  @Get('count')
  getCount() {
    return this.patientService.countAll();
  }
}
