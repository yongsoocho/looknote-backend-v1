import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExtractJwt } from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import { logger } from '../winston/index';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { admin }: any = jwt.decode(
      ExtractJwt.fromAuthHeaderAsBearerToken()(
        context.switchToHttp().getRequest(),
      ),
    );
    if (admin) {
      return true;
    } else {
      logger.error('AdminGuard false error');
      return false;
    }
  }
}
