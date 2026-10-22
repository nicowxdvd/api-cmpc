import { Injectable } from '@nestjs/common';
import { GenresRepository } from './repository/genres.repository';

@Injectable()
export class GenresService {
  constructor(private readonly genresRepository: GenresRepository) {}

  findAll() {
    return this.genresRepository.findAll();
  }
}
