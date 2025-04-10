import { HttpException, HttpStatus, NotFoundException } from "@nestjs/common";

export class DeliveryNotFoundException extends HttpException {
  constructor(message: string, metadata?: any) {
    super(
      {
        message,
        error: "TRANSACTION_CREATION_ERROR",
        statusCode: HttpStatus.NOT_FOUND,
        metadata,
      },
      HttpStatus.NOT_FOUND
    );
  }
}

export class DeliveryStatusUpdateException extends HttpException {
  constructor(message: string, metadata?: any) {
    super(
      {
        message,
        error: "TRANSACTION_CREATION_ERROR",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        metadata,
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
