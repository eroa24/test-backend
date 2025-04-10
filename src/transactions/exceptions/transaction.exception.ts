import { HttpException, HttpStatus } from "@nestjs/common";

export class TransactionCreationException extends HttpException {
  constructor(message: string, metadata?: any) {
    super(
      {
        message,
        error: "TRANSACTION_CREATION_ERROR",
        statusCode: HttpStatus.BAD_REQUEST,
        metadata,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class TransactionValidationException extends HttpException {
  constructor(message: string, metadata?: any) {
    super(
      {
        message,
        error: "TRANSACTION_VALIDATION_ERROR",
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        metadata,
      },
      HttpStatus.UNPROCESSABLE_ENTITY
    );
  }
}

export class InsufficientStockException extends HttpException {
  constructor(
    productId: string,
    requestedQuantity: number,
    availableStock: number
  ) {
    super(
      {
        message: `Stock insuficiente para el producto ${productId}. Cantidad solicitada: ${requestedQuantity}, Stock disponible: ${availableStock}`,
        error: "INSUFFICIENT_STOCK",
        statusCode: HttpStatus.BAD_REQUEST,
        metadata: {
          productId,
          requestedQuantity,
          availableStock,
        },
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class TransactionNotFoundException extends HttpException {
  constructor(message: string, metadata?: any) {
    super(
      {
        message,
        error: "TRANSACTION_NOT_FOUND",
        statusCode: HttpStatus.NOT_FOUND,
        metadata,
      },
      HttpStatus.NOT_FOUND
    );
  }
}
