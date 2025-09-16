// Endereço: apps/backend/src/certificate/dto/batch-delete.dto.ts
import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class BatchDeleteDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];
}
