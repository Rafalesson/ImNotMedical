// apps/backend/src/main.ts

// 1. IMPORTE AS FERRAMENTAS NECESSÁRIAS
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'; // 2. IMPORTE NOSSO FILTRO

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 3. OBTENHA O ADAPTADOR HTTP E REGISTRE O FILTRO GLOBALMENTE
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  // Habilitar o CORS, se necessário (provavelmente já existe no seu código)
  app.enableCors();

  await app.listen(3333);
}
bootstrap();