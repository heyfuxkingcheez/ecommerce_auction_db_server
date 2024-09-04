import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter
  implements ExceptionFilter
{
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // 로그 파일을 생성하거나
    // 에러 모니터링 시스템에 API 콜 하기
    try {
      const status = exception.getStatus();
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
        status: status,
        timestamp: new Date().toLocaleString('kr'),
        message: messageDetail,
        detail: exception.stack,
      };
      console.log(`Error Log : `, errLog);

      response.status(status).json({
        statusCode: status,
        error: exception.message,
        timestamp: new Date().toLocaleString('kr'),
        path: request.url,
      });
    } catch (error) {
      console.error('Error in HttpExceptionFilter:', error);
      response.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        timestamp: new Date().toLocaleString('kr'),
        path: request.url,
      });
    }
  }
}
