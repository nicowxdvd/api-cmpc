import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @IsInt()
  @Min(0)
  precio!: number;

  @IsOptional()
  @IsBoolean()
  disponible?: boolean;

  @IsInt()
  autorId!: number;

  @IsInt()
  generoId!: number;

  @IsInt()
  editorialId!: number;
}
