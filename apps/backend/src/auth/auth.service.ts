// Endereço: apps/backend/src/auth/auth.service.ts (versão limpa)

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomBytes } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class AuthService {
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

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      return;
    }
    const asyncRandomBytes = promisify(randomBytes);
    const token = (await asyncRandomBytes(32)).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expires,
      },
    });
    await this.mailService.sendPasswordResetEmail(user.email, token);
  }
}