// src/certificate/dto/create-certificate.dto.ts
import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  patientId: string; // O ID do paciente para quem é o atestado

  @IsString()
  purpose: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsInt()
  durationInDays?: number;

  @IsOptional()
  @IsString()
  cidCode?: string;

  @IsOptional()
  @IsString()
  cidDescription?: string;

  @IsOptional()
  @IsString()
  observations?: string;
}