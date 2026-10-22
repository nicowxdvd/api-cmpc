import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@admin.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '*******' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
