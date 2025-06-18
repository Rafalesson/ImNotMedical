// src/patient/patient.service.ts (com busca inicial)
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  async search(name: string | undefined) {
    // SE a busca for vazia ou indefinida, retorna os 5 mais recentes.
    if (!name || name.trim() === '') {
      return this.prisma.patientProfile.findMany({
        orderBy: { user: { createdAt: 'desc' } },
        take: 5,
        select: { id: true, name: true, cpf: true, userId: true },
      });
    }

    // SENÃO, faz a busca normal por nome.
    return this.prisma.patientProfile.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      select: { id: true, name: true, cpf: true, userId: true },
      take: 10,
    });
  }
}