import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3001', 'http://172.20.80.1:3001', 'http://192.168.0.2:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  const backendPort = 3333; // Porta definitiva
  await app.listen(backendPort);
  console.log(`Backend rodando com sucesso na porta ${backendPort}`);
}
bootstrap();