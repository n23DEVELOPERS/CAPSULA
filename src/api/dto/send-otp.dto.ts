import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({example: '+998901234567'})
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phone_number: string;
}
