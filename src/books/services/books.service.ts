import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BooksService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(data: CreateBookDto, userId: string): Promise<CreateBookDto> {
    return this.prismaService.book.create({
      data: {
        title: data.title,
        author: data.author,
        year: Number(data.year),
        description: data.description,
        userId: userId,
      },
    });
  }

  async findAll(
    page: number,
    limit: number,
    author?: string,
    year?: number,
  ): Promise<CreateBookDto[]> {
    let whereCondition = {};
    if (author) {
      whereCondition = { ...whereCondition, author: { contains: author } };
    }
    if (year) {
      whereCondition = { ...whereCondition, year };
    }

    const skip = (page - 1) * limit;
    const books = await this.prismaService.book.findMany({
      take: limit,
      skip,
      where: whereCondition,
    });
    return books;
  }

  async findOne(id: string): Promise<CreateBookDto> {
    const book = await this.prismaService.book.findUnique({
      where: {
        id: id,
      },
    });
    return book;
  }

  async update(
    id: string,
    updateBookDto: UpdateBookDto,
    userId: string,
  ): Promise<CreateBookDto> {
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

    return this.prismaService.book.update({
      where: {
        id: id,
      },
      data: updateBookDto,
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    console.log(id, userId);
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
  }
}
