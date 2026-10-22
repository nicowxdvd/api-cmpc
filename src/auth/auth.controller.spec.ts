import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = { login: jest.fn() };

  beforeEach(async () => {
    const modulo = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();
    controller = modulo.get(AuthController);
  });

  it('delega el login en AuthService', async () => {
    const dto = { email: 'admin@admin.com', password: '1234' };
    authService.login.mockResolvedValue({ accessToken: 'token' });

    await expect(controller.login(dto)).resolves.toEqual({ accessToken: 'token' });
    expect(authService.login).toHaveBeenCalledWith(dto);
  });
});