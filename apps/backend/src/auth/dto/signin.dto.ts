// Endereço: apps/backend/src/auth/dto/signin.dto.ts

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Por favor, forneça um endereço de e-mail válido.' })
  @IsNotEmpty({ message: 'O campo de e-mail não pode estar vazio.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'O campo de senha não pode estar vazio.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password: string;
}
