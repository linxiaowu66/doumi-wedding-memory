import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const uuid = uuidv4();
    // 单纯设置在response上的话，在代码执行的过程中使用logger打印，并不会打印出这个requestID，所以request的头部也追加一个
    res.setHeader('x-correlation-id', uuid);
    req.headers['x-correlation-id'] = uuid;
    next();
  }
}
