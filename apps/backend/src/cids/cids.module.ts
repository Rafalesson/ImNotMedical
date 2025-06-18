// src/cids/cids.module.ts
import { Module } from '@nestjs/common';
import { CidsService } from './cids.service';
import { CidsController } from './cids.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CidsController],
  providers: [CidsService],
})
export class CidsModule {}