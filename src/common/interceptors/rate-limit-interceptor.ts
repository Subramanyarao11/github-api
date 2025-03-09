import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err.name === 'ThrottlerException') {
          return throwError(
            () =>
              new HttpException(
                {
                  statusCode: HttpStatus.TOO_MANY_REQUESTS,
                  message: 'Rate limit exceeded. Please try again later.',
                  error: 'Too Many Requests',
                  retryAfter: 60,
                },
                HttpStatus.TOO_MANY_REQUESTS,
              ),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
