import { Module } from '@nestjs/common';

import { BooksService } from './services/books.service';
import { BooksController } from './controllers/books.controller';
import { PrismaService } from '../database/prisma.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [BooksController],
  providers: [BooksService, PrismaService],
})
export class BooksModule {}
