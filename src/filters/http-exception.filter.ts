import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  LoggerService,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(200).json({
      code: status,
      data: null,
      msg: exception.message,
    });
  }
}

export class CustomExceptionFilter implements ExceptionFilter {
  @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService;
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log(exception);
    this.logger.error({ message: exception.message, stack: exception.stack });
    const response = host.switchToHttp().getResponse();
    let msg = '服务异常';
    if (exception && exception.getResponse) {
      const responseEntity = exception.getResponse() as any;

      if (typeof responseEntity === 'object') {
        msg = Array.isArray(responseEntity.message)
          ? responseEntity.message[0]
          : responseEntity.message;
      } else {
        msg = responseEntity;
      }
    }
    response
      .status(
        (exception.getStatus && exception.getStatus()) ||
          HttpStatus.BAD_REQUEST,
      )
      .json({
        statusCode: -1,
        data: null,
        msg,
      });
  }
}
