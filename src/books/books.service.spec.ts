import { Logger, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { BooksService } from './books.service';
import { QueryBooksDto } from './dto/query-books.dto';
import { BooksRepository } from './repository/books.repository';

describe('BooksService', () => {
  let service: BooksService;
  const repo = {
    findAll: jest.fn(),
    findAllForExport: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const query = { orderBy: 'titulo', order: 'asc' } as QueryBooksDto;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(Logger.prototype, 'log').mockImplementation();
    const modulo = await Test.createTestingModule({
      providers: [BooksService, { provide: BooksRepository, useValue: repo }],
    }).compile();
    service = modulo.get(BooksService);
  });

  describe('findOne', () => {
    it('devuelve el libro si existe', async () => {
      repo.findOne.mockResolvedValue({ id: 1 });
      await expect(service.findOne(1)).resolves.toEqual({ id: 1 });
    });

    it('lanza NotFound si no existe', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('crea con el usuario y devuelve el libro', async () => {
      const dto = { titulo: 'Libro' } as never;
      repo.create.mockResolvedValue({ id: 5 });

      await expect(service.create(dto, 2)).resolves.toEqual({ id: 5 });
      expect(repo.create).toHaveBeenCalledWith(dto, 2);
    });
  });

  describe('update', () => {
    it('edita si el libro existe', async () => {
      const dto = { titulo: 'Nuevo' } as never;
      repo.findOne.mockResolvedValue({ id: 1 });
      repo.update.mockResolvedValue({ id: 1, titulo: 'Nuevo' });

      await expect(service.update(1, dto, 2)).resolves.toEqual({ id: 1, titulo: 'Nuevo' });
      expect(repo.update).toHaveBeenCalledWith(1, dto, 2);
    });

    it('lanza NotFound y no edita si no existe', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.update(99, {} as never, 2)).rejects.toThrow(NotFoundException);
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('borra si el libro existe', async () => {
      repo.findOne.mockResolvedValue({ id: 1 });
      await service.remove(1, 2);
      expect(repo.remove).toHaveBeenCalledWith(1, 2);
    });

    it('lanza NotFound y no borra si no existe', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.remove(99, 2)).rejects.toThrow(NotFoundException);
      expect(repo.remove).not.toHaveBeenCalled();
    });
  });

  describe('exportCsv', () => {
    const libro = {
      id: 1,
      titulo: 'El "Quijote"',
      autor: { nombre: 'Cervantes' },
      editorial: { nombre: 'Planeta' },
      genero: { nombre: 'Novela' },
      precio: 1000,
      disponible: true,
    };

    it('arma BOM, encabezado y filas', async () => {
      repo.findAllForExport.mockResolvedValue([libro, { ...libro, id: 2, disponible: false }]);

      const csv = await service.exportCsv(query);
      const lineas = csv.split('\n');

      expect(csv.startsWith('\uFEFF')).toBe(true);
      expect(lineas[0]).toBe('\uFEFF"ID","Título","Autor","Editorial","Género","Precio","Disponible"');
      expect(lineas).toHaveLength(3);
      expect(lineas[1]).toBe('"1","El ""Quijote""","Cervantes","Planeta","Novela","1000","Sí"');
      expect(lineas[2].endsWith('"No"')).toBe(true);
    });

    it('sin libros devuelve solo el encabezado', async () => {
      repo.findAllForExport.mockResolvedValue([]);
      const csv = await service.exportCsv(query);
      expect(csv.split('\n')).toHaveLength(1);
    });
  });
});