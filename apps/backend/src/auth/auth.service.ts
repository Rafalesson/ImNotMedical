// src/auth/auth.service.ts (versão final limpa)
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
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
}