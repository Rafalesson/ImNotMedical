// Endereço: apps/backend/src/main.ts (versão final com whitelist de CORS)

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. Criamos uma "lista de permissões" com as origens que confiamos.
  const whitelist = [
    'http://localhost:3001', 
    'http://192.168.0.2:3001'
  ];

  app.enableCors({
    // 2. A origem agora é uma função que verifica se a requisição veio de um dos endereços da nossa lista.
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        console.log("Origem permitida pelo CORS:", origin)
        callback(null, true);
      } else {
        console.log("Origem bloqueada pelo CORS:", origin)
        callback(new Error('Não permitido pelo CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  await app.listen(3333);
}
bootstrap();