import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { RegisterPayloadDto } from '../dto/register-payload.dto';
import { PrismaService } from '../../database/prisma.service';
import { RegisterResponseDto } from '../dto/register-response.dto';
import { RedisService } from '../../redis/redis.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    private readonly userService: UserService,
  ) {}

  async validateUser({ email, password }: RegisterPayloadDto): Promise<string> {
    const findUser = await this.userService.getUserByEmail(email);
    if (!findUser) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, findUser.password);
    if (!isPasswordValid) {
      throw new HttpException('Неверный пароль!', HttpStatus.UNAUTHORIZED);
    }
    const user = { id: findUser.id, email: findUser.email };

    const token = this.jwtService.sign(user);
    await this.redisService.setToken(user.id, token, 86400000);

    return token;
  }

  async register({
    email,
    username,
    password,
  }: RegisterPayloadDto): Promise<RegisterResponseDto> {
    const findUser = await this.userService.getUserByEmail(email);
    if (findUser) {
      throw new HttpException(
        'User with this email already exists!',
        HttpStatus.CONFLICT,
      );
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.prismaService.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
    return { id: user.id, username: user.username, email: user.email };
  }

  async logout(userId: string): Promise<void> {
    await this.redisService.deleteToken(userId);
  }
}
