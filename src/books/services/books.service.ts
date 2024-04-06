import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BooksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateBookDto, userId: string): Promise<CreateBookDto> {
    try {
      return await this.prismaService.book.create({
        data: {
          title: data.title,
          author: data.author,
          year: Number(data.year),
          description: data.description,
          userId: userId,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Ошибка при создании книги',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
    author?: string,
    year?: number,
  ): Promise<CreateBookDto[]> {
    try {
      let whereCondition = {};
      if (author) {
        whereCondition = { ...whereCondition, author: { contains: author } };
      }
      if (year) {
        whereCondition = { ...whereCondition, year };
      }

      const skip = (page - 1) * limit;
      return await this.prismaService.book.findMany({
        take: limit,
        skip,
        where: whereCondition,
      });
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении списка книг',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<CreateBookDto> {
    try {
      return await this.prismaService.book.findUniqueOrThrow({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new HttpException('Книга не найдена', HttpStatus.NOT_FOUND);
    }
  }

  async update(
    id: string,
    updateBookDto: UpdateBookDto,
    userId: string,
  ): Promise<CreateBookDto> {
    try {
      const book = await this.prismaService.book.findUnique({
        where: {
          id: id,
        },
        select: {
          userId: true,
        },
      });

      if (book.userId !== userId) {
        throw new HttpException(
          'Вы не являетесь владельцем этой книги!',
          HttpStatus.FORBIDDEN,
        );
      }

      return await this.prismaService.book.update({
        where: {
          id: id,
        },
        data: updateBookDto,
      });
    } catch (error) {
      throw new HttpException(
        'Ошибка при обновлении книги',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    try {
      const book = await this.prismaService.book.findUnique({
        where: {
          id: id,
        },
        select: {
          userId: true,
        },
      });

      if (book.userId !== userId) {
        throw new HttpException(
          'Вы не являетесь владельцем этой книги!',
          HttpStatus.FORBIDDEN,
        );
      }

      await this.prismaService.book.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Ошибка при удалении книги',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
