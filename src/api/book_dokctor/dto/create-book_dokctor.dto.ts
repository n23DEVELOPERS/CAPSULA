import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateBookDoctorDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  service_id: number;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  doctor_id: number;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  speciality_id: number;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  patient_id: number;

  @ApiProperty({
    example: '2025-10-10T19:30:00+05:00',
  })
  @IsDateString()
  @IsNotEmpty()
  book_date: Date;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean = false;

  @ApiProperty({
    example: 'Toshken chilonzor',
  })
  @IsString()
  @IsOptional()
  location?: string;
}
