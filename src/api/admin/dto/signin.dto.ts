import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'Jamshid',
    description: 'admin username for signin',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'Jamshid123!',
    description: 'admin password for signin',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
