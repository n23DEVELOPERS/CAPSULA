import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Roles } from 'src/common/enum';

export class CreateAdminDto {
  @ApiProperty({
    example: 'admin1',
    description: 'admin username',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'admin phone number',
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'admin strong password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Roles)
  @IsOptional()
  role: Roles = Roles.ADMIN;

  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
