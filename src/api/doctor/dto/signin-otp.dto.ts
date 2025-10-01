import { IsNotEmpty, IsString } from 'class-validator';

export class SignInOtpDto {
  @IsString()
  @IsNotEmpty()
  phone_number: string;
}
