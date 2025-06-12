// src/auth/auth.controller.ts
import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard'; // <-- IMPORTAR O GUARD

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  // ESTE É O NOSSO NOVO MÉTODO PROTEGIDO
  @UseGuards(AuthGuard) // <-- AQUI COLOCAMOS O "SEGURANÇA" NA PORTA
  @Get('profile')
  getProfile(@Request() req) {
    // Graças ao Guard, o `req.user` agora contém os dados do token
    return req.user;
  }
}