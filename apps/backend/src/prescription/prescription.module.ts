import { Module } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { PrescriptionController } from './prescription.controller';
import { PdfModule } from 'src/pdf/pdf.module';
import { TemplatesModule } from 'src/templates/templates.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [PdfModule, TemplatesModule, CloudinaryModule],
  controllers: [PrescriptionController],
  providers: [PrescriptionService],
})
export class PrescriptionModule {}
