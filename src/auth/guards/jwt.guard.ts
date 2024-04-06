import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RedisService } from '../../redis/redis.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);

    if (!canActivate) {
      return false;
    }

    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization.split('Bearer ')[1];

    if (!req.user || !req.user.id) {
      return false;
    }

    const userId = req.user.id;

    const storedToken = await this.redisService.getToken(userId);

    return token === storedToken;
  }
}
