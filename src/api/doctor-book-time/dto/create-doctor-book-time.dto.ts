import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateDoctorBookTimeDto {
  @ApiProperty({
    example: '',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    example: '',
  })
  @IsDateString()
  @IsNotEmpty()
  start_time: string;

  @ApiProperty({
    example: '',
  })
  @IsDateString()
  @IsOptional()
  finish_time: string;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
