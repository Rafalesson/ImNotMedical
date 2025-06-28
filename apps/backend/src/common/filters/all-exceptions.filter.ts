// Endereço: apps/backend/src/common/filters/all-exceptions.filter.ts (VERSÃO FINAL CORRIGIDA)

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // ==========================================================
    // A CORREÇÃO ESTÁ AQUI! Adicionamos o log do erro.
    // ==========================================================
    console.error('[AllExceptionsFilter] Exceção capturada:', exception);

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBodyFromException =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const responseBody = {
      statusCode: httpStatus,
      error:
        typeof responseBodyFromException === 'object' && responseBodyFromException['error']
          ? responseBodyFromException['error']
          : HttpStatus[httpStatus],
      message:
        typeof responseBodyFromException === 'object'
          ? responseBodyFromException['message']
          : responseBodyFromException,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}