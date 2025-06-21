// apps/backend/src/common/filters/all-exceptions.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

// 1. O decorador @Catch() sem argumentos intercepta TODAS as exceções.
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // 2. Injetamos o HttpAdapterHost para ter controle sobre a resposta HTTP.
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  // 3. Este é o método principal que será executado para cada exceção.
  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    // 4. Determinamos o status HTTP e a mensagem da exceção.
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBodyFromException =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // 5. Montamos nosso objeto de resposta padronizado.
    const responseBody = {
      statusCode: httpStatus,
      // Se a resposta da exceção for um objeto, usamos a propriedade 'error', senão, usamos um nome padrão.
      error:
        typeof responseBodyFromException === 'object' && responseBodyFromException['error']
          ? responseBodyFromException['error']
          : HttpStatus[httpStatus],
      // Se a resposta da exceção for um objeto, usamos 'message', senão, a própria resposta.
      message:
        typeof responseBodyFromException === 'object'
          ? responseBodyFromException['message']
          : responseBodyFromException,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    // 6. Usamos o adaptador HTTP para enviar nossa resposta formatada.
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}