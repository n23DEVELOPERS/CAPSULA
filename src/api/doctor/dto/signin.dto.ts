import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SigninDtoDoctor {
  @ApiProperty({
    example: '+998900474604',
  })
  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    example: 'Jamshid123!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
