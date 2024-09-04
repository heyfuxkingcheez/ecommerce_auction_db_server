import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionInterceptor
  implements NestInterceptor
{
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction('READ COMMITTED');

    req.queryRunner = qr;

    return next.handle().pipe(
      catchError(async (error) => {
        await qr.rollbackTransaction();
        await qr.release();

        if (error instanceof HttpException) {
          throw error;
        } else {
          console.error(error);
          throw new InternalServerErrorException(
            '서버 오류가 발생했습니다.',
          );
        }
      }),
      tap(async () => {
        await qr.commitTransaction();
        await qr.release();
      }),
    );
  }
}
