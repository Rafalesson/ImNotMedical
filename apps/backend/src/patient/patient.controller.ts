// src/patient/patient.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('patients')
@UseGuards(AuthGuard) // Protegendo todas as rotas de pacientes
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get('search')
  search(@Query('name') name: string) {
    return this.patientService.search(name);
  }
}