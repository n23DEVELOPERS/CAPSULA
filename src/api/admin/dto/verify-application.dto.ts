import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class VerifyApplicationDto {
  @ApiProperty({ description: 'Set true to verify, false to reject' })
  @IsBoolean()
  @IsNotEmpty()
  isVerified: boolean;
}
