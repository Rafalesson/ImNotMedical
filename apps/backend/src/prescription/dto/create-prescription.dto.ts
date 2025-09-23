import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PrescriptionItemDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  observation?: string;
}

export class CreatePrescriptionDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  patientId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PrescriptionItemDto)
  items!: PrescriptionItemDto[];

  @IsOptional()
  @IsString()
  generalGuidance?: string;

  @IsOptional()
  @IsString()
  additionalNotes?: string;

  @IsOptional()
  @IsString()
  templateId?: string;
}
