import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';

import { BooksService } from '../services/books.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { AuthResponseDto } from '../../auth/dto/auth-response.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOperation({ summary: 'Добавление новой книги' })
  @ApiBody({ type: CreateBookDto, description: 'Данные книги' })
  @ApiResponse({ type: CreateBookDto, description: 'Результат запроса' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Токен авторизации',
    example: 'Bearer YOUR_AUTH_TOKEN',
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createBookDto: CreateBookDto,
    @Req() req: { user: AuthResponseDto },
  ): Promise<CreateBookDto> {
    return await this.booksService.create(createBookDto, req.user.id);
  }

  @ApiOperation({ summary: 'Получение всех книг' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Номер страницы',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Количество элементов на странице',
    type: Number,
  })
  @ApiQuery({
    name: 'author',
    required: false,
    description: 'Имя автора книги',
    type: String,
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Год издания книги',
    type: Number,
  })
  @ApiResponse({ type: [CreateBookDto], description: 'Список книг' })
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('author') author?: string,
    @Query('year') year?: string,
  ): Promise<CreateBookDto[]> {
    return await this.booksService.findAll(+page, +limit, author, +year);
  }

  @ApiOperation({ summary: 'Получение книги по id' })
  @ApiParam({ name: 'id', description: 'ID книги', type: String })
  @ApiResponse({ type: CreateBookDto, description: 'Данные книги' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CreateBookDto> {
    return await this.booksService.findOne(id);
  }

  @ApiOperation({ summary: 'Редактирование книги по id' })
  @ApiParam({ name: 'id', description: 'ID книги', type: String })
  @ApiBody({ type: UpdateBookDto, description: 'Новые данные книги' })
  @ApiResponse({ type: CreateBookDto, description: 'Данные книги' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Токен авторизации',
    example: 'Bearer YOUR_AUTH_TOKEN',
  })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @Req() req: { user: AuthResponseDto },
  ): Promise<CreateBookDto> {
    return await this.booksService.update(id, updateBookDto, req.user.id);
  }

  @ApiOperation({ summary: 'Удаление книги по id' })
  @ApiParam({ name: 'id', description: 'ID книги', type: String })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Токен авторизации',
    example: 'Bearer YOUR_AUTH_TOKEN',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @Req() req: { user: AuthResponseDto },
  ): Promise<void> {
    await this.booksService.remove(id, req.user.id);
  }
}
