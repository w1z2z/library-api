import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { LocalGuard } from '../guards/local.guard';
import { AuthService } from '../services/auth.service';
import { RegisterPayloadDto } from '../dto/register-payload.dto';
import { RegisterResponseDto } from '../dto/register-response.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { AuthResponseDto } from '../dto/auth-response.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Войти в систему' })
  @ApiBody({ type: RegisterPayloadDto, description: 'Auth payload' })
  @ApiResponse({ type: String, description: 'Access token' })
  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request): Express.User {
    return req.user;
  }

  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: RegisterPayloadDto, description: 'Register payload' })
  @ApiResponse({ type: RegisterResponseDto, description: 'Register response' })
  @Post('register')
  register(@Body() payload: RegisterPayloadDto): Promise<RegisterResponseDto> {
    return this.authService.register(payload);
  }

  @ApiOperation({ summary: 'Выход из системы' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Токен авторизации',
    example: 'Bearer YOUR_AUTH_TOKEN',
  })
  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: { user: AuthResponseDto }): Promise<void> {
    console.log(123123);
    await this.authService.logout(req.user.id);
  }
}
