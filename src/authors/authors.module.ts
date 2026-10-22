import { Module } from '@nestjs/common';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { AuthorsRepository } from './repository/authors.repository';

@Module({
  controllers: [AuthorsController],
  providers: [AuthorsService, AuthorsRepository],
})
export class AuthorsModule {}
