import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  const usersService = { findByEmail: jest.fn() };
  const jwtService = { signAsync: jest.fn() };
  const compare = bcrypt.compare as unknown as jest.Mock;
  const usuario = { id: 1, email: 'admin@admin.com', password: 'hash' };

  beforeEach(async () => {
    jest.clearAllMocks();
    const modulo = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();
    service = modulo.get(AuthService);
  });

  it('devuelve el token con credenciales válidas', async () => {
    usersService.findByEmail.mockResolvedValue(usuario);
    compare.mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValue('token');

    const res = await service.login({ email: usuario.email, password: '1234' });

    expect(res).toEqual({ accessToken: 'token' });
    expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 1, email: usuario.email });
  });

  it('lanza 401 si el usuario no existe', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(service.login({ email: 'x@x.com', password: '1234' })).rejects.toThrow(UnauthorizedException);
    expect(compare).not.toHaveBeenCalled();
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it('lanza 401 si la contraseña no coincide', async () => {
    usersService.findByEmail.mockResolvedValue(usuario);
    compare.mockResolvedValue(false);

    await expect(service.login({ email: usuario.email, password: 'mala' })).rejects.toThrow(UnauthorizedException);
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

   });