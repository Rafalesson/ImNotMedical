// Endereço: apps/backend/src/patient/patient.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  async search(name: string | undefined) {
    if (!name || name.trim() === '') {
      return this.prisma.patientProfile.findMany({
        orderBy: {
          user: {
            createdAt: 'desc',
          },
        },
        take: 5,
        select: {
          id: true,
          name: true,
          cpf: true,
          userId: true,
          dateOfBirth: true,
          sex: true,
        },
      });
    }

    // A busca por nome agora terá uma ordenação.
    return this.prisma.patientProfile.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        cpf: true,
        userId: true,
        dateOfBirth: true,
        sex: true,
      },
      take: 10,
    });
  }

  async countAll(): Promise<{ count: number }> {
    const count = await this.prisma.patientProfile.count();
    return { count };
  }
}
