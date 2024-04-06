import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<string> {
    const user = await this.authService.validateUser({
      email,
      password,
    });
    if (!user) {
      throw new HttpException(
        'Неверная почта или пароль!',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
