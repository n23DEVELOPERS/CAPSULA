import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDoctorBookTimeDto {
  @ApiProperty({
    example: '13.10.2025',
  })
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
