import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class QueryBooksDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  autorId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  generoId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  editorialId?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  disponible?: boolean;

  @IsOptional()
  @IsIn(['titulo', 'precio', 'id'])
  orderBy: 'titulo' | 'precio' | 'id' = 'id';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order: 'asc' | 'desc' = 'asc';
}
