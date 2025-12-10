import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Log the error for debugging
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      this.logger.warn(
        `HTTP Exception: ${status} - ${JSON.stringify(response)}`,
      );
    } else {
      // Log full error details for non-HTTP exceptions
      this.logger.error(
        `Unhandled Exception: ${exception instanceof Error ? exception.message : 'Unknown error'}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    // Log request details for debugging
    this.logger.debug(
      `Request: ${request.method} ${request.url} - Status: ${status}`,
    );

    const responseBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            success: false,
            message:
              exception instanceof Error
                ? exception.message
                : 'Internal server error',
            ...(process.env.NODE_ENV === 'development' && {
              stack: exception instanceof Error ? exception.stack : undefined,
            }),
          };

    const payload =
      typeof responseBody === 'object' && responseBody !== null
        ? responseBody
        : { success: false, message: String(responseBody) };

    httpAdapter.reply(ctx.getResponse(), payload, status);
  }
}
