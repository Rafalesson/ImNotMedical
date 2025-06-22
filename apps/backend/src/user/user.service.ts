// Endereço: apps/backend/src/user/user.service.ts (versão final corrigida)

import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Desestruturamos todos os campos do DTO, incluindo o novo endereço
    const {
      email, password, role, name, phone,
      crm, specialty,
      cpf, dateOfBirth, sex,
      street, number, complement, neighborhood, city, state, zipCode
    } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Verificamos se já existe um usuário com este e-mail
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Um usuário com este e-mail já existe.');
    }

    // A criação do endereço agora é um objeto aninhado
    const addressData = (street && number && neighborhood && city && state && zipCode) ? {
      street, number, complement, neighborhood, city, state, zipCode
    } : undefined;

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role, // O DTO já garante que este é um Enum 'Role'
        phone,
        doctorProfile: role === Role.DOCTOR ? {
          create: {
            name,
            crm: crm || '', // Garante que não seja undefined
            specialty,
            phone,
            // Conecta ou cria o endereço se os dados foram fornecidos
            ...(addressData && { address: { create: addressData } })
          },
        } : undefined,
        patientProfile: role === Role.PATIENT ? {
          create: {
            name,
            cpf: cpf || '', // Garante que não seja undefined
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
            sex, // O DTO já garante que este é um Enum 'Sex'
            phone,
            ...(addressData && { address: { create: addressData } })
          },
        } : undefined,
      },
      // Incluímos os perfis e endereços na resposta para confirmação
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
        doctorProfile: { include: { address: true } }, // Incluímos o endereço aqui também
        patientProfile: { include: { address: true } },
      },
    });
  }
}