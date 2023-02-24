import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Injectable,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const dt = Date.now();

    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        console.log(`Execução levou: ${Date.now() - dt} milisegundos!`);
        console.log(`URL: ${request.url}`);
        console.log(`METHOD: ${request.method}`);
      }),
    );
  }
}
