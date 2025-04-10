import { HttpStatus } from "@nestjs/common";
import { BaseException } from "../../common/exceptions/base.exception";

export class ProductNotFoundException extends BaseException {
  constructor(productId: string) {
    super(
      `Producto con ID ${productId} no encontrado`,
      HttpStatus.NOT_FOUND,
      "PRODUCT_NOT_FOUND",
      { productId }
    );
  }
}

export class ProductCreationException extends BaseException {
  constructor(message: string, metadata?: Record<string, any>) {
    super(message, HttpStatus.BAD_REQUEST, "PRODUCT_CREATION_ERROR", metadata);
  }
}

export class ProductValidationException extends BaseException {
  constructor(message: string, metadata?: Record<string, any>) {
    super(
      message,
      HttpStatus.UNPROCESSABLE_ENTITY,
      "PRODUCT_VALIDATION_ERROR",
      metadata
    );
  }
}

export class ProductDuplicateException extends BaseException {
  constructor(productName: string) {
    super(
      `Ya existe un producto con el nombre: ${productName}`,
      HttpStatus.CONFLICT,
      "PRODUCT_DUPLICATE",
      { productName }
    );
  }
}

export class ProductInsufficientStockException extends BaseException {
  constructor(productId: string, requested: number, available: number) {
    super(
      `Stock insuficiente para el producto con ID ${productId}. Solicitado: ${requested}, Disponible: ${available}`,
      HttpStatus.BAD_REQUEST,
      "PRODUCT_INSUFFICIENT_STOCK",
      { productId, requested, available }
    );
  }
}
