import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'Cien años de soledad' })
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @ApiProperty({ example: 12990, minimum: 0 })
  @IsInt()
  @Min(0)
  precio!: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  disponible?: boolean;

  @ApiProperty({ example: 1 })
  @IsInt()
  autorId!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  generoId!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  editorialId!: number;
}
