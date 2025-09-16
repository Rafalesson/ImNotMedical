// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService],
  // ADICIONE ESTA LINHA ABAIXO
  exports: [UserService], // <-- ESSA LINHA É A SOLUÇÃO!
})
export class UserModule {}
