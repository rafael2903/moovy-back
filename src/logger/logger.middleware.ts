import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(
      `Logging HTTP request ${req.method} ${req.url} ${res.statusCode}`,
    );
    this.logger.log(`Request body: ${JSON.stringify(req.body)}`);
    this.logger.log(`Request query: ${JSON.stringify(req.query)}`);
    this.logger.log(`Request params: ${JSON.stringify(req.params)}`);
    next();
  }
}
