import { Body, Controller, Delete, Get, Header, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';
import { ApiBearerAuth, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';

@ApiTags('books')
@ApiBearerAuth()
@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Lista libros con filtros, orden y paginación' })
  findAll(@Query() query: QueryBooksDto) {
    return this.booksService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de un libro' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un libro' })
  create(@Body() dto: CreateBookDto, @Req() req: { user: { id: number } }) {
    return this.booksService.create(dto, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edita un libro' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookDto, @Req() req: { user: { id: number } }) {
    return this.booksService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un libro (soft delete)' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: { user: { id: number } }) {
    return this.booksService.remove(id, req.user.id);
  }

  @Get('export/csv')
  @ApiOperation({ summary: 'Exporta a CSV con los mismos filtros del listado' })
  @ApiProduces('text/csv')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="libros.csv"')
  exportCsv(@Query() query: QueryBooksDto) {
    return this.booksService.exportCsv(query);
  }
}
