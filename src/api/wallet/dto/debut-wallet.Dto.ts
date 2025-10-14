import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class DebutWalletDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  debutBalans: number;
}
