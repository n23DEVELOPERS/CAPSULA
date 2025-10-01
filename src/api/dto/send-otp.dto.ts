import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class SendOtpDto {
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phone: string;
}
