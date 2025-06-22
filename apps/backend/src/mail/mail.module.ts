// Endereço: apps/backend/src/mail/mail.module.ts (versão corrigida)

import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService], 
})
export class MailModule {}