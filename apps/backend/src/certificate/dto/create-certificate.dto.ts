// Endereço: apps/backend/src/certificate/dto/create-certificate.dto.ts (Versão Corrigida)

import {
  IsString,
  IsInt,
  IsOptional,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @IsString()
  @IsNotEmpty()
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

  @IsOptional()
  @IsString()
  templateId?: string;
}