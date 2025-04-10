import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { ExecutionContext, CallHandler } from "@nestjs/common";
import { of } from "rxjs";
import { Request } from "express";

describe("TransformInterceptor", () => {
  let interceptor: TransformInterceptor<any>;
  let mockContext: Partial<ExecutionContext>;
  let mockRequest: Partial<Request>;
  let mockHandler: Partial<CallHandler>;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
    mockRequest = {
      url: "/test",
      method: "GET",
    };
    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => mockRequest,
      }),
    };
    mockHandler = {
      handle: jest.fn().mockReturnValue(of({ data: "test" })),
    };
  });

  it("should be defined", () => {
    expect(interceptor).toBeDefined();
  });

  it("should transform response data", (done) => {
    const testData = { id: 1, name: "test" };
    mockHandler.handle = jest.fn().mockReturnValue(of(testData));

    interceptor
      .intercept(mockContext as ExecutionContext, mockHandler as CallHandler)
      .subscribe({
        next: (value) => {
          expect(value).toEqual({
            success: true,
            data: testData,
            metadata: {
              timestamp: expect.any(String),
              path: "/test",
              method: "GET",
            },
          });
          done();
        },
      });
  });

  it("should handle null response data", (done) => {
    mockHandler.handle = jest.fn().mockReturnValue(of(null));

    interceptor
      .intercept(mockContext as ExecutionContext, mockHandler as CallHandler)
      .subscribe({
        next: (value) => {
          expect(value).toEqual({
            success: true,
            data: null,
            metadata: {
              timestamp: expect.any(String),
              path: "/test",
              method: "GET",
            },
          });
          done();
        },
      });
  });

  it("should include request metadata", (done) => {
    const testData = { id: 1, name: "test" };
    mockHandler.handle = jest.fn().mockReturnValue(of(testData));

    interceptor
      .intercept(mockContext as ExecutionContext, mockHandler as CallHandler)
      .subscribe({
        next: (value) => {
          expect(value.metadata).toEqual({
            timestamp: expect.any(String),
            path: "/test",
            method: "GET",
          });
          done();
        },
      });
  });
});
