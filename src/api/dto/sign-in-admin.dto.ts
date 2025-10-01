import { IsNotEmpty, IsString } from 'class-validator';

export class SignInAdminDto {
  @IsNotEmpty()
  @IsString()
  usernameOrPhone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
