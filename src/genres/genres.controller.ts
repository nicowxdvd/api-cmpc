import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GenresService } from './genres.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('genres')
@ApiBearerAuth()
@Controller('genres')
@UseGuards(JwtAuthGuard)
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  @ApiOperation({ summary: 'Lista los generos' })
  findAll() {
    return this.genresService.findAll();
  }
}
