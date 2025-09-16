// src/cids/cids.service.ts (versão com lista curada)
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// Nossa lista de CIDs mais comuns para sugestão inicial
const commonCidCodes = [
  'J00', // Resfriado Comum
  'J06.9', // Infecção aguda das vias aéreas superiores
  'A09', // Diarreia e gastroenterite
  'M54.5', // Dor lombar baixa
  'R51', // Cefaleia (Dor de cabeça)
  'K29.7', // Gastrite
  'N39.0', // Infecção do trato urinário
  'H10.9', // Conjuntivite
  'L29.9', // Prurido (Coceira)
  'R42', // Tontura e vertigem
];

@Injectable()
export class CidsService {
  constructor(private prisma: PrismaService) {}

  async search(query: string | undefined) {
    // SE a busca for vazia, busca apenas os códigos da nossa lista VIP.
    if (!query || query.trim() === '') {
      return this.prisma.cidCode.findMany({
        where: {
          code: {
            in: commonCidCodes,
          },
        },
      });
    }

    // SENÃO, faz a busca normal por código ou descrição no banco todo.
    return this.prisma.cidCode.findMany({
      where: {
        OR: [
          { code: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 15,
    });
  }
}
