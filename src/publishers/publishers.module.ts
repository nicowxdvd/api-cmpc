import { Module } from '@nestjs/common';
import { PublishersController } from './publishers.controller';
import { PublishersService } from './publishers.service';
import { PublishersRepository } from './repository/publishers.repository';

@Module({
  controllers: [PublishersController],
  providers: [PublishersService, PublishersRepository],
})
export class PublishersModule {}
