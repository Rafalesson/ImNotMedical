// src/user/user.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// O UpdateUserDto não será usado agora
// import { UpdateUserDto } from './dto/update-user.dto'; 

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // VAMOS MANTER APENAS ESTE MÉTODO POR ENQUANTO
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /*
  // VAMOS COMENTAR OU APAGAR OS OUTROS MÉTODOS POR AGORA

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
  */
}