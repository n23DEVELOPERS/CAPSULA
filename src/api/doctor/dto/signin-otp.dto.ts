import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInOtpDto {
  @ApiProperty({
    example: '+998900474604',
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string;
}
