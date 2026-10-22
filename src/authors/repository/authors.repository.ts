import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.autor.findMany({ orderBy: { nombre: 'asc' } });
  }
}
