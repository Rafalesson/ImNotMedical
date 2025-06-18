// src/auth/jwt.strategy.ts (versão final)
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET não foi definido no arquivo .env. A aplicação não pode iniciar.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  // ATUALIZAMOS ESTE MÉTODO PARA RETORNAR TODOS OS DADOS DO PAYLOAD
  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.name, // <-- Agora o req.user também terá o nome
    };
  }
}