import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SignInUserDto {
  @ApiProperty({example: '+998901234567'})
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
