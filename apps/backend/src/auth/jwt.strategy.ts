// Endereco: apps/backend/src/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Prisma } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET nao foi definido no arquivo .env.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { sub: number | string; email: string }) {
    const userId =
      typeof payload.sub === 'string'
        ? Number.parseInt(payload.sub, 10)
        : payload.sub;

    const user = (await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        doctorProfile: { include: { address: true } },
        patientProfile: { include: { address: true } },
      },
    })) as Prisma.UserGetPayload<{
      include: {
        doctorProfile: { include: { address: true } };
        patientProfile: { include: { address: true } };
      };
    }> | null;

    if (!user) {
      throw new UnauthorizedException('Usuario nao encontrado.');
    }

    return user;
  }
}
