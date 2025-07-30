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
    console.log('--- INICIANDO CRIAÇÃO DE USUÁRIO ---');
    console.log('Dados recebidos do formulário:', JSON.stringify(createUserDto, null, 2));

    const {
      email, password, role, name, phone,
      crm, specialty,
      cpf, dateOfBirth, sex,
      street, number, complement, neighborhood, city, state, zipCode
    } = createUserDto;

    console.log('Passo 1: Verificando se usuário existe...');
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Um usuário com este e-mail já existe.');
    }
    
    if (role === Role.PATIENT && (!cpf || !dateOfBirth)) {
      throw new BadRequestException('CPF e Data de Nascimento são obrigatórios para pacientes.');
    }
    
    console.log('Passo 2: Criptografando a senha (TEMPORARIAMENTE DESATIVADO)...');
    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = password; // Usando a senha pura APENAS para teste

    console.log('Passo 3: Preparando dados do endereço...');
    const addressData = (street && number && neighborhood && city && state && zipCode) ? {
      street, number, complement, neighborhood, city, state, zipCode
    } : undefined;

    const data: Prisma.UserCreateInput = {
      email,
      password: hashedPassword,
      role,
      phone,
    };

    if (role === Role.DOCTOR) {
      data.doctorProfile = { create: { name, crm: crm || '', specialty, phone, ...(addressData && { address: { create: addressData } }) } };
    } else if (role === Role.PATIENT) {
      data.patientProfile = { create: { name, cpf, dateOfBirth: new Date(dateOfBirth), sex, phone, ...(addressData && { address: { create: addressData } }) } };
    }

    try {
      console.log('Passo 4: Chegou ao bloco try. Tentando criar no banco...');
      const user = await this.prisma.user.create({
        data,
        include: {
          doctorProfile: { include: { address: true } },
          patientProfile: { include: { address: true } }
        }
      });
      
      console.log('--- USUÁRIO CRIADO COM SUCESSO ---');
      const { password: _, ...result } = user;
      return result;

    } catch (error) {
      console.error('--- ERRO CAPTURADO NO USER SERVICE ---');
      console.error('Mensagem do Erro:', error.message);
      console.error('Objeto de Erro Completo:', JSON.stringify(error, null, 2));

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const fields = (error.meta?.target as string[]) || [];
          throw new BadRequestException(`Os seguintes dados já estão em uso: ${fields.join(', ')}.`);
        }
      }
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