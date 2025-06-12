// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // A variável 'hashedPassword' é definida aqui
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const user = await this.prisma.user.create({
      data: {
        // A variável 'createUserDto' é usada aqui
        ...createUserDto,
        // E a 'hashedPassword' é usada aqui
        password: hashedPassword,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  // Este é o método que o AuthService precisa
  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}