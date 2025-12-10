import { HttpException, HttpStatus } from '@nestjs/common';
export declare class AppError extends HttpException {
    constructor(message: string, status?: HttpStatus, metadata?: Record<string, unknown>);
}
