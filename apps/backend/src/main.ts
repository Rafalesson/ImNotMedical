// Endereço: apps/backend/src/main.ts

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const whitelist = [
    'http://localhost:3001', 
    'http://192.168.0.2:3001',
    'http://172.20.80.1:3001',
    'https://zello-zellos-projects-cea7c733.vercel.app',
    'https://zello-zellos-projects-cea7c733.vercel.app/' // MODIFICAÇÃO: Adicionada a URL com uma barra no final por segurança
  ];

  app.enableCors({
    origin: function (origin, callback) {
      // MODIFICAÇÃO: Adicionado log de diagnóstico para comparar a origem exata
      console.log(`[CORS DIAGNÓSTICO] Origem da Requisição: "${origin}"`);
      console.log(`[CORS DIAGNÓSTICO] A origem está na whitelist? ${whitelist.indexOf(origin) !== -1}`);

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

  // MODIFICAÇÃO: A linha abaixo foi comentada para desativar o filtro de exceções temporariamente.
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  await app.listen(3333);
}
bootstrap();