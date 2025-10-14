import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class ConfirmForgotPasswordDto {
  @ApiProperty({
    example: '+998991111111',
    description: 'Foydalanuvchi telefon raqami',
  })
  @IsPhoneNumber('UZ')
  phone_number: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'Yangi parol',
  })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  newPassword: string;
}
