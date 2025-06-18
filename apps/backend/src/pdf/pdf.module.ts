// src/pdf/pdf.module.ts (versão final simplificada)
import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';

@Module({
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule {}