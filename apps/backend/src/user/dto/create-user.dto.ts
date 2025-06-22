// Endereço: apps/backend/src/user/dto/create-user.dto.ts (versão final corrigida)

import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
  ValidateIf,
} from 'class-validator';
import { Role, Sex } from '@prisma/client'; // 1. IMPORTAMOS OS ENUMS GERADOS PELO PRISMA

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;

  @IsEnum(Role, { message: 'O cargo deve ser DOCTOR ou PATIENT' })
  role: Role; // 2. AGORA USAMOS O TIPO 'Role'

  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsOptional()
  @IsString()
  phone?: string;

  // --- CAMPOS DE DOUTOR (só são obrigatórios se role === 'DOCTOR') ---
  @ValidateIf(o => o.role === Role.DOCTOR)
  @IsNotEmpty({ message: 'CRM é obrigatório para médicos.'})
  crm?: string;

  @IsOptional()
  @IsString()
  specialty?: string;
  
  // --- CAMPOS DE PACIENTE (só são obrigatórios se role === 'PATIENT') ---
  @ValidateIf(o => o.role === Role.PATIENT)
  @IsNotEmpty({ message: 'CPF é obrigatório para pacientes.'})
  cpf?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
  
  @IsOptional()
  @IsEnum(Sex, { message: 'O sexo deve ser MALE, FEMALE ou OTHER' })
  sex?: Sex; // 3. AGORA USAMOS O TIPO 'Sex'

  // --- 4. CAMPOS DE ENDEREÇO ESTRUTURADO (OPCIONAIS) ---
  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  number?: string;
  
  @IsOptional()
  @IsString()
  complement?: string;

  @IsOptional()
  @IsString()
  neighborhood?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;
}