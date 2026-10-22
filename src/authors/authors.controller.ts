import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthorsService } from './authors.service';

@Controller('authors')
@UseGuards(JwtAuthGuard)
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  findAll() {
    return this.authorsService.findAll();
  }
}
