import { BaseException } from "../../exceptions/base.exception";
import { HttpStatus } from "@nestjs/common";

describe("BaseException", () => {
  it("should create exception with default values", () => {
    const exception = new BaseException("Test error");
    expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(exception.message).toBe("Test error");
    expect(exception.code).toBe("INTERNAL_ERROR");
    expect(exception.details).toBeUndefined();
  });

  it("should create exception with custom status", () => {
    const exception = new BaseException("Not found", HttpStatus.NOT_FOUND);
    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
    expect(exception.message).toBe("Not found");
  });

  it("should create exception with custom code", () => {
    const exception = new BaseException(
      "Validation error",
      HttpStatus.BAD_REQUEST,
      "VALIDATION_ERROR"
    );
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    expect(exception.code).toBe("VALIDATION_ERROR");
  });

  it("should create exception with details", () => {
    const details = { field: "email", message: "invalid format" };
    const exception = new BaseException(
      "Validation error",
      HttpStatus.BAD_REQUEST,
      "VALIDATION_ERROR",
      details
    );
    expect(exception.details).toEqual(details);
  });

  it("should get response with all properties", () => {
    const details = { field: "email", message: "invalid format" };
    const exception = new BaseException(
      "Validation error",
      HttpStatus.BAD_REQUEST,
      "VALIDATION_ERROR",
      details
    );
    const response = exception.getResponse();
    expect(response).toMatchObject({
      message: "Validation error",
      code: "VALIDATION_ERROR",
      details,
    });
  });
});
