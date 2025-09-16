// Endereço: apps/backend/src/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // 2. INJETAMOS O PRISMA SERVICE NO CONSTRUTOR
  constructor(private prisma: PrismaService) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET não foi definido no arquivo .env.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  // 3. ESTE MÉTODO FOI COMPLETAMENTE REESCRITO
  async validate(payload: { sub: string; email: string }) {
    // Após validar a assinatura do token, usamos o ID (payload.sub) para buscar o usuário completo.
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      // Este 'include' é a chave! Ele diz ao Prisma para trazer os perfis relacionados.
      include: {
        doctorProfile: {
          include: {
            address: true,
          },
        },
        patientProfile: {
          include: {
            address: true,
          },
        },
      },
    });

    // Se por algum motivo o usuário do token não existir mais no banco, rejeitamos.
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    return user;
  }
}
