import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PublishersService } from './publishers.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('publishers')
@ApiBearerAuth()
@Controller('publishers')
@UseGuards(JwtAuthGuard)
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) {}

  @Get()
  @ApiOperation({ summary: 'Lista los editoriales' })
  findAll() {
    return this.publishersService.findAll();
  }
}
