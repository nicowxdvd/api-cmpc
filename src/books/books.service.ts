import { Injectable, NotFoundException } from '@nestjs/common';
import { BooksRepository } from './repository/books.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';

@Injectable()
export class BooksService {
  constructor(private readonly booksRepository: BooksRepository) {}

  findAll(query: QueryBooksDto) {
    return this.booksRepository.findAll(query);
  }

  async findOne(id: number) {
    const libro = await this.booksRepository.findOne(id);
    if (!libro) throw new NotFoundException('Libro no encontrado');
    return libro;
  }

  create(dto: CreateBookDto) {
    return this.booksRepository.create(dto);
  }

  async update(id: number, dto: UpdateBookDto) {
    await this.findOne(id);
    return this.booksRepository.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.booksRepository.remove(id);
  }
}
