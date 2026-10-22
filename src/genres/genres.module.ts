import { Module } from '@nestjs/common';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { GenresRepository } from './repository/genres.repository';

@Module({
  controllers: [GenresController],
  providers: [GenresService, GenresRepository],
})
export class GenresModule {}
