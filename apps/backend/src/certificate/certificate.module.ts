// src/certificate/certificate.module.ts (versão final corrigida)
import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { PdfModule } from 'src/pdf/pdf.module';
import { TemplatesModule } from 'src/templates/templates.module'; 
@Module({
  imports: [PdfModule, TemplatesModule], 
  controllers: [CertificateController],
  providers: [CertificateService],
  exports: [CertificateService],
})
export class CertificateModule {}