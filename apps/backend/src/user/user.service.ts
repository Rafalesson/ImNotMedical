// src/user/user.service.ts (versão final e corrigida)
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // AQUI ESTÁ A PRIMEIRA PARTE DA CORREÇÃO:
    // Agora desestruturamos TODOS os campos que vêm do DTO.
    const {
      email,
      password,
      role,
      name,
      crm,
      specialty, // <-- Novo
      address,   // <-- Novo
      phone,     // <-- Novo
      cpf,
      dateOfBirth,
      sex,       // <-- Novo
    } = createUserDto;

    // A lógica de hashing continua a mesma
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        // AQUI ESTÁ A SEGUNDA PARTE DA CORREÇÃO:
        // Passamos os novos campos para o Prisma na criação dos perfis.
        ...(role === 'DOCTOR' && {
          doctorProfile: {
            create: { name, crm: crm || '', specialty, address, phone }, // <-- Campos novos adicionados
          },
        }),
        ...(role === 'PATIENT' && {
          patientProfile: {
            create: {
              name,
              cpf: cpf || '',
              dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
              sex, // <-- Campo novo adicionado
            },
          },
        }),
      },
    });
    
    // A lógica de remover a senha continua a mesma
    const { password: _, ...result } = user;
    return result;
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        doctorProfile: true,
        patientProfile: true,
      },
    });
  }
}