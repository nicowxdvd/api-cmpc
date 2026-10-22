import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

const errores: Record<string, { status: number; message: string }> = {
  P2003: { status: HttpStatus.BAD_REQUEST, message: 'Autor, género o editorial no existe' },
  P2025: { status: HttpStatus.NOT_FOUND, message: 'Registro no encontrado' },
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const error = errores[exception.code];

    if (!error) {
      this.logger.error(`${exception.code}: ${exception.message}`);
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error interno del servidor' });
    }

    response.status(error.status).json({ statusCode: error.status, message: error.message });
  }
}
