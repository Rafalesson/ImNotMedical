// Endereço: apps/backend/src/auth/dto/reset-password.dto.ts

import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'O token é obrigatório.' })
  token: string;

  @IsString()
  @MinLength(6, { message: 'A nova senha deve ter no mínimo 6 caracteres.' })
  @IsNotEmpty({ message: 'O campo de senha não pode estar vazio.' })
  password: string;

  // Usamos a validação @Matches para garantir que este campo seja igual ao campo 'password'.
  // A lógica de comparação em si será feita no serviço para uma mensagem de erro mais clara,
  // mas esta é uma boa prática para ter no DTO.
  @IsString()
  @IsNotEmpty({ message: 'A confirmação de senha não pode estar vazia.' })
  passwordConfirmation: string;
}
