import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponse } from "../types/api-response.type";

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  private readonly logger = new Logger(TransformInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    return next.handle().pipe(
      map((data) => {
        const response: ApiResponse<T> = {
          success: true,
          data,
          metadata: {
            timestamp: new Date().toISOString(),
            path: url,
            method,
          },
        };

        this.logger.log(
          `[${method}] ${url} - Response: ${JSON.stringify(response)}`
        );

        return response;
      })
    );
  }
}
