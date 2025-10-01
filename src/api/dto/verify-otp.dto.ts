import { IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phone: string;

  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}
