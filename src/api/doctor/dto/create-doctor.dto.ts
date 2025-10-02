import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Gender, Roles } from 'src/common/enum';

export class CreateDoctorWithDocumentDto {
  // Doctor ma’lumotlari
  @ApiProperty({
    example: 'mutahasislik idsi',
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  speciality: number;

  // @ApiProperty({
  //   example: 'service idsi',
  // })
  @IsNumber()
  @IsOptional()
  services: string;

  @ApiProperty({
    example: 'Bek',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    example: 'Olimjon',
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    example: '+998900474600',
  })
  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    example: 25,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    example: Gender.MALE,
    enum: Gender,
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({
    example: 'Tashkent, Uzbekistan',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active: boolean;

  @ApiProperty({
    example: Roles.DOCTOR,
    enum: Roles,
    default: Roles.DOCTOR,
  })
  @IsEnum(Roles)
  @IsOptional()
  role: Roles = Roles.DOCTOR;

  // Doctor_document ma’lumotlari
  // @ApiProperty({
  //   example: 'photo_url',
  // })
  // @IsString()
  // @IsNotEmpty()
  // passport_url: string;

  // @ApiProperty({
  //   example: 'photo_url',
  // })
  // @IsString()
  // @IsOptional()
  // diplom_url: string;

  // @ApiProperty({
  //   example: 'photo_url',
  // })
  // @IsString()
  // @IsOptional()
  // certificate_url: string;

  // @ApiProperty({
  //   example: 'photo_url',
  // })
  // @IsString()
  // @IsOptional()
  // self_employment_url: string;

  // @ApiProperty({
  //   example: 'photo_url',
  // })
  // @IsString()
  // @IsOptional()
  // image_url: string;
}
