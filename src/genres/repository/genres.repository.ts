import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GenresRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.genero.findMany({ orderBy: { nombre: 'asc' } });
  }
}
