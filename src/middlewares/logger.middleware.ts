import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as os from 'os';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;
    const now = Date.now();
    this.logger.log(
      `STARTING ${method} ${originalUrl} with ${
        request.headers['x-correlation-id']
      } on ${os.hostname()}[${process.pid}], ${
        // eslint-disable-next-line no-nested-ternary
        method === 'GET'
          ? `Query => ${JSON.stringify(request.query)}`
          : JSON.stringify(request.body).length > 5000 // 防止请求体过大造成日志过长
          ? `Body => ${JSON.stringify(request.body).slice(0, 5000)}...`
          : `Body => ${JSON.stringify(request.body)}`
      }`,
    );

    response.on('finish', () => {
      const { statusCode } = response;
      const uuid = response.getHeader('x-correlation-id');

      this.logger.log(
        `ENDING ${method} ${originalUrl} with ${uuid} [${statusCode}] cost ${
          Date.now() - now
        }ms`,
      );
    });

    next();
  }
}
