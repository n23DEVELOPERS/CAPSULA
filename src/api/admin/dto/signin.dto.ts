import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'Suhrob',
    description: 'admin username for signin',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'Suhrob123!',
    description: 'admin password for signin',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
