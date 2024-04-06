import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterResponseDto {
  @ApiProperty()
  id: string;

  @IsString()
  username: string;

  @ApiProperty()
  email: string;
}
