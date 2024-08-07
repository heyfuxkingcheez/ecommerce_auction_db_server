import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { timestamp } from 'rxjs';
import { Response } from 'express';
import { emailValidationMessage } from './../validation-message/email-validation.message';

@Catch(HttpException)
export class HttpExceptionFilter
  implements ExceptionFilter
{
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    // 로그 파일을 생성하거나
    // 에러 모니터링 시스템에 API 콜 하기

    const exceptionsResponse = exception.getResponse();
    let errorResponse: any = {};

    if (typeof exceptionsResponse === 'string') {
      errorResponse.message = exceptionsResponse;
    } else if (typeof exceptionsResponse === 'object') {
      errorResponse = { ...exceptionsResponse };
    }

    const messageDetail = errorResponse.message;

    let errLog = {
      userId: request.user ? request.user.id : 'PUBLIC',
      path: request.url,
      timestamp: new Date().toLocaleString('kr'),
      message: messageDetail,
      detail: exception.stack,
    };
    console.log(`Error Log : `, errLog);

    response.status(status).json({
      statusCode: status,
      error: exception.message,
      // detail: messageDetail,
      timestamp: new Date().toLocaleString('kr'),
      path: request.url,
    });
  }
}
