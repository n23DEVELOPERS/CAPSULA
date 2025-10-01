import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
