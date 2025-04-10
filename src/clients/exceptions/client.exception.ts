import { HttpException, HttpStatus } from "@nestjs/common";

export class ClientCreationException extends HttpException {
  constructor(message: string, metadata?: any) {
    super(
      {
        message,
        error: "CLIENT_CREATION_ERROR",
        statusCode: HttpStatus.BAD_REQUEST,
        metadata,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class ClientValidationException extends HttpException {
  constructor(message: string, metadata?: any) {
    super(
      {
        message,
        error: "CLIENT_VALIDATION_ERROR",
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        metadata,
      },
      HttpStatus.UNPROCESSABLE_ENTITY
    );
  }
}

export class ClientDuplicateException extends HttpException {
  constructor(email: string) {
    super(
      {
        message: `Ya existe un cliente registrado con el email: ${email}`,
        error: "CLIENT_DUPLICATE",
        statusCode: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT
    );
  }
}

export class ClientNotFoundException extends HttpException {
  constructor(id: string) {
    super(
      {
        message: `Cliente con ID ${id} no encontrado`,
        error: "CLIENT_NOT_FOUND",
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND
    );
  }
}
