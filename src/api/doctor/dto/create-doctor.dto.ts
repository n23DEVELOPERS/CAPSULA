import { ApiProperty } from '@nestjs/swagger';
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

export class CreateDoctorDto {
  // @ApiProperty({
  //   example: "mutahasislikning id'si",
  // })
  // @IsNumber()
  // @IsNotEmpty()
  // speciality: string;

  @ApiProperty({
    example: "servicening id'si",
  })
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
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    example: Gender.MALE
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({
    example: "Tashkent, ..."
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @IsBoolean()
  @IsOptional()
  is_active: boolean;

  @IsEnum(Roles)
  @IsOptional()
  role: Roles.DOCTOR;

  // Doctor document uchun

  // @IsString()
  // @IsNotEmpty()
  // passport_url: string;

  // @IsString()
  // @IsNotEmpty()
  // diplom_url: string;

  // @IsString()
  // @IsNotEmpty()
  // certificate_url: string;

  // @IsString()
  // @IsNotEmpty()
  // self_employment_url: string;

  // @IsString()
  // @IsNotEmpty()
  // image_url: string;
}
