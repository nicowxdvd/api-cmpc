import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { QueryBooksDto } from '../dto/query-books.dto';

const include = { autor: true, genero: true, editorial: true };

@Injectable()
export class BooksRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(query: QueryBooksDto): Prisma.LibroWhereInput {
    const { search, autorId, generoId, editorialId, disponible } = query;
    return {
      deletedAt: null,
      autorId,
      generoId,
      editorialId,
      disponible,
      titulo: search ? { contains: search, mode: 'insensitive' } : undefined,
    };
  }

  async findAll(query: QueryBooksDto) {
    const { page, limit, orderBy, order } = query;
    const where = this.buildWhere(query);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.libro.findMany({
        where,
        include,
        orderBy: { [orderBy]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.libro.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  findAllForExport(query: QueryBooksDto) {
    const { orderBy, order } = query;
    return this.prisma.libro.findMany({
      where: this.buildWhere(query),
      include,
      orderBy: { [orderBy]: order },
    });
  }

  findOne(id: number) {
    return this.prisma.libro.findFirst({ where: { id, deletedAt: null }, include });
  }

  create(dto: CreateBookDto) {
    return this.prisma.libro.create({ data: dto, include });
  }

  update(id: number, dto: UpdateBookDto) {
    return this.prisma.libro.update({ where: { id }, data: dto, include });
  }

  remove(id: number) {
    return this.prisma.libro.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
