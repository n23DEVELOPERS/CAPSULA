import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Min,
} from 'class-validator';
import { Gender } from 'src/common/enum/index';

export class CreatePatientDto {
  @ApiProperty({ example: 'Ali' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Valiev' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({ example: 'MALE' })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({ example: 24 })
  @Min(16)
  @IsInt()
  @IsNotEmpty()
  age: number;

  @ApiProperty({ example: 'AliV123!' })
  @IsStrongPassword()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'Chilonzor t. 14 kv. 8 dom' })
  @IsString()
  @IsNotEmpty()
  location: string;
}
