import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryBooksDto } from '../dto/query-books.dto';
import { BooksRepository } from './books.repository';

describe('BooksRepository', () => {
  let repo: BooksRepository;
  const tx = {
    libro: { create: jest.fn(), update: jest.fn() },
    log: { create: jest.fn() },
  };
  const prisma = {
    libro: { findMany: jest.fn(), count: jest.fn(), findFirst: jest.fn() },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const modulo = await Test.createTestingModule({
      providers: [BooksRepository, { provide: PrismaService, useValue: prisma }],
    }).compile();
    repo = modulo.get(BooksRepository);
  });

  describe('findAll', () => {
    it('filtra, pagina y excluye borrados', async () => {
      const query = { page: 3, limit: 10, orderBy: 'titulo', order: 'asc', search: 'har', autorId: 2, disponible: true } as QueryBooksDto;
      prisma.libro.findMany.mockReturnValue('findMany');
      prisma.libro.count.mockReturnValue('count');
      prisma.$transaction.mockResolvedValue([[{ id: 1 }], 25]);

      const res = await repo.findAll(query);

      expect(res).toEqual({ data: [{ id: 1 }], total: 25, page: 3, limit: 10 });
      expect(prisma.libro.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            deletedAt: null,
            autorId: 2,
            disponible: true,
            titulo: { contains: 'har', mode: 'insensitive' },
          }),
          orderBy: { titulo: 'asc' },
          skip: 20,
          take: 10,
        }),
      );
    });

    it('sin search no filtra por título', async () => {
      const query = { page: 1, limit: 5, orderBy: 'id', order: 'desc' } as QueryBooksDto;
      prisma.$transaction.mockResolvedValue([[], 0]);

      await repo.findAll(query);

      expect(prisma.libro.count).toHaveBeenCalledWith({
        where: expect.objectContaining({ deletedAt: null, titulo: undefined }),
      });
    });
  });

  describe('findAllForExport', () => {
    it('filtra y ordena sin paginar', async () => {
      const query = { orderBy: 'titulo', order: 'asc', generoId: 4 } as QueryBooksDto;
      prisma.libro.findMany.mockResolvedValue([{ id: 1 }]);

      await expect(repo.findAllForExport(query)).resolves.toEqual([{ id: 1 }]);
      expect(prisma.libro.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ deletedAt: null, generoId: 4 }),
          orderBy: { titulo: 'asc' },
        }),
      );
      expect(prisma.libro.findMany.mock.calls[0][0]).not.toHaveProperty('take');
    });
  });

  describe('findOne', () => {
    it('busca solo libros no borrados', async () => {
      prisma.libro.findFirst.mockResolvedValue({ id: 1 });

      await repo.findOne(1);

      expect(prisma.libro.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1, deletedAt: null } }),
      );
    });
  });

  describe('operaciones con auditoría', () => {
    beforeEach(() => {
      prisma.$transaction.mockImplementation((cb: (t: typeof tx) => unknown) => cb(tx));
    });

    it('create guarda el libro y el log', async () => {
      const dto = { titulo: 'Libro' } as never;
      tx.libro.create.mockResolvedValue({ id: 5 });

      await expect(repo.create(dto, 2)).resolves.toEqual({ id: 5 });
      expect(tx.log.create).toHaveBeenCalledWith({
        data: { usuarioId: 2, accion: 'CREAR_LIBRO', detalles: { libroId: 5, titulo: 'Libro' } },
      });
    });

    it('update guarda el cambio y el log', async () => {
      const dto = { titulo: 'Nuevo' } as never;
      tx.libro.update.mockResolvedValue({ id: 3, titulo: 'Nuevo' });

      await expect(repo.update(3, dto, 2)).resolves.toEqual({ id: 3, titulo: 'Nuevo' });
      expect(tx.log.create).toHaveBeenCalledWith({
        data: { usuarioId: 2, accion: 'EDITAR_LIBRO', detalles: { libroId: 3, titulo: 'Nuevo' } },
      });
    });

    it('remove marca deletedAt y guarda el log', async () => {
      await repo.remove(3, 2);

      expect(tx.libro.update).toHaveBeenCalledWith({ where: { id: 3 }, data: { deletedAt: expect.any(Date) } });
      expect(tx.log.create).toHaveBeenCalledWith({
        data: { usuarioId: 2, accion: 'BORRAR_LIBRO', detalles: { libroId: 3 } },
      });
    });

    it('si falla el log, la transacción rechaza', async () => {
      tx.libro.create.mockResolvedValue({ id: 5 });
      tx.log.create.mockRejectedValue(new Error('fallo'));

      await expect(repo.create({} as never, 2)).rejects.toThrow('fallo');
    });
  });
});import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryBooksDto } from '../dto/query-books.dto';
import { BooksRepository } from './books.repository';

describe('BooksRepository', () => {
  let repo: BooksRepository;
  const tx = {
    libro: { create: jest.fn(), update: jest.fn() },
    log: { create: jest.fn() },
  };
  const prisma = {
    libro: { findMany: jest.fn(), count: jest.fn(), findFirst: jest.fn() },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const modulo = await Test.createTestingModule({
      providers: [BooksRepository, { provide: PrismaService, useValue: prisma }],
    }).compile();
    repo = modulo.get(BooksRepository);
  });

  describe('findAll', () => {
    it('filtra, pagina y excluye borrados', async () => {
      const query = { page: 3, limit: 10, orderBy: 'titulo', order: 'asc', search: 'har', autorId: 2, disponible: true } as QueryBooksDto;
      prisma.libro.findMany.mockReturnValue('findMany');
      prisma.libro.count.mockReturnValue('count');
      prisma.$transaction.mockResolvedValue([[{ id: 1 }], 25]);

      const res = await repo.findAll(query);

      expect(res).toEqual({ data: [{ id: 1 }], total: 25, page: 3, limit: 10 });
      expect(prisma.libro.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            deletedAt: null,
            autorId: 2,
            disponible: true,
            titulo: { contains: 'har', mode: 'insensitive' },
          }),
          orderBy: { titulo: 'asc' },
          skip: 20,
          take: 10,
        }),
      );
    });

    it('sin search no filtra por título', async () => {
      const query = { page: 1, limit: 5, orderBy: 'id', order: 'desc' } as QueryBooksDto;
      prisma.$transaction.mockResolvedValue([[], 0]);

      await repo.findAll(query);

      expect(prisma.libro.count).toHaveBeenCalledWith({
        where: expect.objectContaining({ deletedAt: null, titulo: undefined }),
      });
    });
  });

  describe('findAllForExport', () => {
    it('filtra y ordena sin paginar', async () => {
      const query = { orderBy: 'titulo', order: 'asc', generoId: 4 } as QueryBooksDto;
      prisma.libro.findMany.mockResolvedValue([{ id: 1 }]);

      await expect(repo.findAllForExport(query)).resolves.toEqual([{ id: 1 }]);
      expect(prisma.libro.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ deletedAt: null, generoId: 4 }),
          orderBy: { titulo: 'asc' },
        }),
      );
      expect(prisma.libro.findMany.mock.calls[0][0]).not.toHaveProperty('take');
    });
  });

  describe('findOne', () => {
    it('busca solo libros no borrados', async () => {
      prisma.libro.findFirst.mockResolvedValue({ id: 1 });

      await repo.findOne(1);

      expect(prisma.libro.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1, deletedAt: null } }),
      );
    });
  });

  describe('operaciones con auditoría', () => {
    beforeEach(() => {
      prisma.$transaction.mockImplementation((cb: (t: typeof tx) => unknown) => cb(tx));
    });

    it('create guarda el libro y el log', async () => {
      const dto = { titulo: 'Libro' } as never;
      tx.libro.create.mockResolvedValue({ id: 5 });

      await expect(repo.create(dto, 2)).resolves.toEqual({ id: 5 });
      expect(tx.log.create).toHaveBeenCalledWith({
        data: { usuarioId: 2, accion: 'CREAR_LIBRO', detalles: { libroId: 5, titulo: 'Libro' } },
      });
    });

    it('update guarda el cambio y el log', async () => {
      const dto = { titulo: 'Nuevo' } as never;
      tx.libro.update.mockResolvedValue({ id: 3, titulo: 'Nuevo' });

      await expect(repo.update(3, dto, 2)).resolves.toEqual({ id: 3, titulo: 'Nuevo' });
      expect(tx.log.create).toHaveBeenCalledWith({
        data: { usuarioId: 2, accion: 'EDITAR_LIBRO', detalles: { libroId: 3, titulo: 'Nuevo' } },
      });
    });

    it('remove marca deletedAt y guarda el log', async () => {
      await repo.remove(3, 2);

      expect(tx.libro.update).toHaveBeenCalledWith({ where: { id: 3 }, data: { deletedAt: expect.any(Date) } });
      expect(tx.log.create).toHaveBeenCalledWith({
        data: { usuarioId: 2, accion: 'BORRAR_LIBRO', detalles: { libroId: 3 } },
      });
    });

    it('si falla el log, la transacción rechaza', async () => {
      tx.libro.create.mockResolvedValue({ id: 5 });
      tx.log.create.mockRejectedValue(new Error('fallo'));

      await expect(repo.create({} as never, 2)).rejects.toThrow('fallo');
    });
  });
});
