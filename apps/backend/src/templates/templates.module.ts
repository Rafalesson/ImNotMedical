import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';

@Module({
  providers: [TemplatesService],
  exports: [TemplatesService], // Esta linha é crucial
})
export class TemplatesModule {}