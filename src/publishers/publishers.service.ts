import { Injectable } from '@nestjs/common';
import { PublishersRepository } from './repository/publishers.repository';

@Injectable()
export class PublishersService {
  constructor(private readonly publishersRepository: PublishersRepository) {}

  findAll() {
    return this.publishersRepository.findAll();
  }
}
