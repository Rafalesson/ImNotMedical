// Endereço: apps/backend/src/user/user.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const {
      email, password, role, name, phone,
      crm, specialty,
      cpf, dateOfBirth, sex,
      street, number, complement, neighborhood, city, state, zipCode
    } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Um usuário com este e-mail já existe.');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const addressData = (street && number && neighborhood && city && state && zipCode) ? {
      street, number, complement, neighborhood, city, state, zipCode
    } : undefined;

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          phone,
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
              dateOfBirth: new Date(dateOfBirth!),
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

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const fields = (error.meta?.target as string[]) || [];
          throw new BadRequestException(`Os seguintes dados já estão em uso: ${fields.join(', ')}.`);
        }
      }
      console.error("Erro inesperado ao criar usuário:", error);
      throw new BadRequestException('Não foi possível criar o usuário devido a um erro interno. Verifique os dados fornecidos.');
    }
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