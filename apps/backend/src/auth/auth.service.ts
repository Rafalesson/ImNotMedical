// Endereço: apps/backend/src/auth/auth.service.ts (versão final com forgotPassword)

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service'; // Importamos nosso serviço de e-mail
import { PrismaService } from 'src/prisma/prisma.service'; // Importamos o Prisma para fazer o update
import { randomBytes } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class AuthService {
  // 1. Injetamos os novos serviços que vamos usar no construtor
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private prisma: PrismaService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.userService.findOneByEmail(email);

    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const profile = user.doctorProfile || user.patientProfile;
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: profile?.name,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // ==========================================================
  // NOVA FUNÇÃO PARA RECUPERAÇÃO DE SENHA
  // ==========================================================
  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findOneByEmail(email);

    // Por segurança, não disparamos um erro se o usuário não for encontrado.
    if (!user) {
      return;
    }

    // Gera um token aleatório e seguro
    const asyncRandomBytes = promisify(randomBytes);
    const token = (await asyncRandomBytes(32)).toString('hex');

    // Define a data de expiração para o token (1 hora a partir de agora)
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    // Atualiza o usuário no banco de dados com o token e a data de expiração
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expires,
      },
    });

    // Envia o e-mail usando nosso MailService
    await this.mailService.sendPasswordResetEmail(user.email, token);
  }
}