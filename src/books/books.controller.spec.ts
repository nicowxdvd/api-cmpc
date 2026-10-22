import { Test } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { QueryBooksDto } from './dto/query-books.dto';

describe('BooksController', () => {
  let controller: BooksController;
  const service = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    exportCsv: jest.fn(),
  };
  const req = { user: { id: 7 } };

  beforeEach(async () => {
    jest.clearAllMocks();
    const modulo = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [{ provide: BooksService, useValue: service }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = modulo.get(BooksController);
  });

  it('findAll pasa el query al servicio', async () => {
    const query = { page: 1, limit: 10 } as QueryBooksDto;
    service.findAll.mockResolvedValue({ data: [], total: 0 });

    await expect(controller.findAll(query)).resolves.toEqual({ data: [], total: 0 });
    expect(service.findAll).toHaveBeenCalledWith(query);
  });

  it('findOne pasa el id', async () => {
    service.findOne.mockResolvedValue({ id: 3 });
    await expect(controller.findOne(3)).resolves.toEqual({ id: 3 });
    expect(service.findOne).toHaveBeenCalledWith(3);
  });

  it('create pasa el dto y el id del usuario del token', async () => {
    const dto = { titulo: 'Libro' } as never;
    await controller.create(dto, req);
    expect(service.create).toHaveBeenCalledWith(dto, 7);
  });

  it('update pasa id, dto y usuario', async () => {
    const dto = { titulo: 'Nuevo' } as never;
    await controller.update(3, dto, req);
    expect(service.update).toHaveBeenCalledWith(3, dto, 7);
  });

  it('remove pasa id y usuario', async () => {
    await controller.remove(3, req);
    expect(service.remove).toHaveBeenCalledWith(3, 7);
  });

  it('exportCsv pasa el query al servicio', async () => {
    const query = { disponible: true } as QueryBooksDto;
    service.exportCsv.mockResolvedValue('csv');

    await expect(controller.exportCsv(query)).resolves.toBe('csv');
    expect(service.exportCsv).toHaveBeenCalledWith(query);
  });
});