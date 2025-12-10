import { HttpException, HttpStatus } from '@nestjs/common';

export class AppError extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    metadata?: Record<string, unknown>,
  ) {
    super(
      {
        success: false,
        message,
        ...(metadata ? { metadata } : {}),
      },
      status,
    );
  }
}
