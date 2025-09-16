// src/cids/cids.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CidsService } from './cids.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('cids')
@UseGuards(AuthGuard) // Só usuários logados podem buscar CIDs
export class CidsController {
  constructor(private readonly cidsService: CidsService) {}

  @Get('search')
  search(@Query('query') query: string) {
    return this.cidsService.search(query);
  }
}
