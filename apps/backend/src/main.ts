import { config as loadEnv } from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

loadEnv();

if (!process.env.JWT_SECRET) {
  const fallbackEnvPaths = [
    join(process.cwd(), 'apps', 'backend', '.env'),
    join(__dirname, '..', '.env'),
  ];

  for (const envPath of fallbackEnvPaths) {
    if (existsSync(envPath)) {
      loadEnv({ path: envPath });
      if (process.env.JWT_SECRET) {
        break;
      }
    }
  }
}

function normalizeOrigin(origin?: string) {
  if (!origin) {
    return undefined;
  }
  return origin.endsWith('/') ? origin.slice(0, -1) : origin;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const whitelist = new Set(
    [
      'http://localhost:3001',
      'http://192.168.0.2:3001',
      'http://172.20.80.1:3001',
      'https://zello-zellos-projects-cea7c733.vercel.app',
    ].map(normalizeOrigin),
  );

  const frontendUrl = normalizeOrigin(process.env.FRONTEND_URL?.trim());
  if (frontendUrl) {
    whitelist.add(frontendUrl);

    try {
      const parsed = new URL(frontendUrl);
      const host = parsed.host.replace(/^www\./, '');
      const protocol = parsed.protocol;
      const withoutWww = normalizeOrigin(`${protocol}//${host}`);
      const withWww = normalizeOrigin(`${protocol}//www.${host}`);
      if (withoutWww) {
        whitelist.add(withoutWww);
      }
      if (withWww) {
        whitelist.add(withWww);
      }
    } catch (error) {
      console.warn(
        '[CORS] FRONTEND_URL is not a valid URL:',
        frontendUrl,
        error,
      );
    }
  }

  const isProduction = process.env.NODE_ENV === 'production';

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = normalizeOrigin(origin);
      const isAllowed = normalizedOrigin
        ? whitelist.has(normalizedOrigin)
        : false;

      if (isAllowed) {
        return callback(null, true);
      }

      const baseMessage = `[CORS] Origin ${origin} is not in whitelist`;
      const message = frontendUrl
        ? `${baseMessage} (current FRONTEND_URL=${frontendUrl})`
        : baseMessage;

      if (!isProduction) {
        console.warn(
          `${message}. Allowing because NODE_ENV=${process.env.NODE_ENV ?? 'development'}`,
        );
        return callback(null, true);
      }

      console.warn(`${message}. Blocking request.`);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  const port = Number(process.env.PORT) || 3333;
  await app.listen(port, '0.0.0.0');
  console.log(`Server is listening on port ${port}`);
}
void bootstrap();
