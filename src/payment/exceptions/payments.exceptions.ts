import { HttpStatus, HttpException } from "@nestjs/common";
import { error } from "console";

export class TokenCreationException extends HttpException {
  constructor(message: string, metadata?: any) {
    super(
      {
        message,
        error: "TOKEN_CREATION_ERROR",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        metadata,
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

export class TermsAndConditionsException extends HttpException {
  constructor(message: string, metadata?: any) {
    super(
      {
        message,
        error: "TYC_ERROR",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        metadata,
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

export class PaymentCreationException extends HttpException {
  constructor(message: string, metadata?: any) {
    super(
      {
        message,
        error: "PAYMENT_CREATION_ERROR",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        metadata,
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
