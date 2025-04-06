import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ApiResponse } from "../types/api-response.type";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    let errorCode = "UNKNOWN_ERROR";
    if (status === HttpStatus.BAD_REQUEST) {
      errorCode = "BAD_REQUEST";
    } else if (status === HttpStatus.UNAUTHORIZED) {
      errorCode = "UNAUTHORIZED";
    } else if (status === HttpStatus.FORBIDDEN) {
      errorCode = "FORBIDDEN";
    } else if (status === HttpStatus.NOT_FOUND) {
      errorCode = "NOT_FOUND";
    } else if (status === HttpStatus.CONFLICT) {
      errorCode = "CONFLICT";
    } else if (status === HttpStatus.UNPROCESSABLE_ENTITY) {
      errorCode = "VALIDATION_ERROR";
    } else if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      errorCode = "INTERNAL_SERVER_ERROR";
    }

    if (exceptionResponse && exceptionResponse.code) {
      errorCode = exceptionResponse.code;
    }

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: errorCode,
        message: exceptionResponse.message || exception.message,
        details: exceptionResponse.details || null,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        statusCode: status,
      },
    };

    this.logger.error(
      `[${request.method}] ${request.url} - Error: ${JSON.stringify(
        errorResponse
      )}`,
      exception.stack
    );

    response.status(status).json(errorResponse);
  }
}
