import { IsNotEmpty, IsString } from 'class-validator';

export class SignInAdminDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
