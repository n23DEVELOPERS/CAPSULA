import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({example: '+998901234567'})
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phone_number: string;

  @ApiProperty({example: '123456'})
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}
