import { BadRequestException, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UserIdCheckMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('UserIdCheckMiddleware antes!');

    if (isNaN(Number(req.params.id)) || Number(req.params.id) <= 0) {
      throw new BadRequestException('Id inválido!');
    }

    console.log('UserIdCheckMiddleware depois!');

    next();
  }
}
