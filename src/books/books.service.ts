import { Injectable, NotFoundException } from '@nestjs/common';
import { BooksRepository } from './repository/books.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';

const escapar = (valor: string | number) => `"${String(valor).replace(/"/g, '""')}"`;
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

  async exportCsv(query: QueryBooksDto) {
    const libros = await this.booksRepository.findAllForExport(query);
    const encabezado = ['ID', 'Título', 'Autor', 'Editorial', 'Género', 'Precio', 'Disponible'];
    const filas = libros.map((l) => [
      l.id,
      l.titulo,
      l.autor.nombre,
      l.editorial.nombre,
      l.genero.nombre,
      l.precio,
      l.disponible ? 'Sí' : 'No',
    ]);
    const lineas = [encabezado, ...filas].map((fila) => fila.map(escapar).join(','));
    return '\uFEFF' + lineas.join('\n');
  }
}
