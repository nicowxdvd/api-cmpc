import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BooksRepository } from './repository/books.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';

const escapar = (valor: string | number) => `"${String(valor).replace(/"/g, '""')}"`;
@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);
  constructor(private readonly booksRepository: BooksRepository) {}

  findAll(query: QueryBooksDto) {
    return this.booksRepository.findAll(query);
  }

  async findOne(id: number) {
    const libro = await this.booksRepository.findOne(id);
    if (!libro) throw new NotFoundException('Libro no encontrado');
    return libro;
  }

  async create(dto: CreateBookDto, usuarioId: number) {
    const libro = await this.booksRepository.create(dto, usuarioId);
    this.logger.log(`Usuario ${usuarioId} creó el libro ${libro.id}`);
    return libro;
  }

  async update(id: number, dto: UpdateBookDto, usuarioId: number) {
    await this.findOne(id);
    const libro = await this.booksRepository.update(id, dto, usuarioId);
    this.logger.log(`Usuario ${usuarioId} editó el libro ${id}`);
    return libro;
  }

  async remove(id: number, usuarioId: number) {
    await this.findOne(id);
    await this.booksRepository.remove(id, usuarioId);
    this.logger.log(`Usuario ${usuarioId} borró el libro ${id}`);
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
