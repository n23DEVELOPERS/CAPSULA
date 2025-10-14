import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VerifyApplicationDto {
  @ApiProperty({ description: 'Set true to verify, false to reject' })
  @IsBoolean()
  @IsNotEmpty()
  isVerified: boolean;

  @ApiProperty({ description: 'description for reject' })
  @IsString()
  @IsOptional()
  description: string;
}
