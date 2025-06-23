// Endereço: apps/backend/src/user/user.service.ts (versão final e corrigida)

import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Desestruturamos todos os campos do DTO, incluindo o novo endereço estruturado
    const {
      email, password, role, name, phone,
      crm, specialty,
      cpf, dateOfBirth, sex,
      street, number, complement, neighborhood, city, state, zipCode
    } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Um usuário com este e-mail já existe.');
    }

    // Preparamos os dados do endereço para serem criados de forma aninhada
    const addressData = (street && number && neighborhood && city && state && zipCode) ? {
      street, number, complement, neighborhood, city, state, zipCode
    } : undefined;

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        phone,
        // CORREÇÃO PRINCIPAL AQUI:
        // A criação do perfil agora também cria o endereço de forma aninhada, se os dados existirem.
        doctorProfile: role === Role.DOCTOR ? {
          create: {
            name,
            crm: crm || '',
            specialty,
            phone,
            ...(addressData && { address: { create: addressData } })
          },
        } : undefined,
        patientProfile: role === Role.PATIENT ? {
          create: {
            name,
            cpf: cpf || '',
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
            sex,
            phone,
            ...(addressData && { address: { create: addressData } })
          },
        } : undefined,
      },
      include: {
        doctorProfile: { include: { address: true } },
        patientProfile: { include: { address: true } }
      }
    });

    const { password: _, ...result } = user;
    return result;
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        doctorProfile: { include: { address: true } },
        patientProfile: { include: { address: true } },
      },
    });
  }
}