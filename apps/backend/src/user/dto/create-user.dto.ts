// apps/backend/src/user/dto/create-user.dto.ts (versão final completa)
import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';

enum UserRole {
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  password: string;

  @IsEnum(UserRole, { message: 'O cargo deve ser DOCTOR ou PATIENT' })
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  name: string;

  // --- Novos campos de perfil adicionados como opcionais ---

  @IsOptional()
  @IsString()
  crm?: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
  
  @IsOptional()
  @IsString()
  sex?: string;
}