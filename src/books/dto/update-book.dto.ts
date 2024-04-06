import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateBookDto } from './create-book.dto';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  year?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsUUID()
  userId?: string;
}
