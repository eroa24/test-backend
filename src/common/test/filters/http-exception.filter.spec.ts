import { HttpExceptionFilter } from "../../filters/http-exception.filter";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ArgumentsHost } from "@nestjs/common";
import { Request, Response } from "express";

describe("HttpExceptionFilter", () => {
  let filter: HttpExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;
  let mockHost: Partial<ArgumentsHost>;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockRequest = {
      url: "/test",
      method: "GET",
    };
    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    };
  });

  it("should be defined", () => {
    expect(filter).toBeDefined();
  });

  it("should handle BadRequestException", () => {
    const exception = new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
    filter.catch(exception, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Bad Request",
          details: null,
        },
      })
    );
  });

  it("should handle NotFoundException", () => {
    const exception = new HttpException("Not Found", HttpStatus.NOT_FOUND);
    filter.catch(exception, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Not Found",
          details: null,
        },
      })
    );
  });

  it("should handle custom exception with code and details", () => {
    const exception = new HttpException(
      {
        message: "Custom Error",
        code: "CUSTOM_ERROR",
        details: { field: "error" },
      },
      HttpStatus.BAD_REQUEST
    );
    filter.catch(exception, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: {
          code: "CUSTOM_ERROR",
          message: "Custom Error",
          details: { field: "error" },
        },
      })
    );
  });

  it("should include metadata in response", () => {
    const exception = new HttpException("Test Error", HttpStatus.BAD_REQUEST);
    filter.catch(exception, mockHost as ArgumentsHost);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: {
          timestamp: expect.any(String),
          path: "/test",
          method: "GET",
          statusCode: HttpStatus.BAD_REQUEST,
        },
      })
    );
  });
});
