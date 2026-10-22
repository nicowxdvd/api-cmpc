import { Injectable } from '@nestjs/common';
import { AuthorsRepository } from './repository/authors.repository';

@Injectable()
export class AuthorsService {
  constructor(private readonly authorsRepository: AuthorsRepository) {}

  findAll() {
    return this.authorsRepository.findAll();
  }
}
