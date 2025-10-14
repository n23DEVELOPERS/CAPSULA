import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsNotEmpty,
  Length,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Wallet_type } from 'src/common/enum';

export class CreateWalletDto {
  @ApiProperty({ example: 'Ali' })
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiProperty({ example: '9860 1234 1234 5678' })
  @Length(16, 16)
  @IsNotEmpty()
  @IsString()
  card_number: string;

  @ApiProperty({ example: 'HUMO' })
  @IsString()
  @IsEnum(Wallet_type)
  @IsNotEmpty()
  type: Wallet_type;

  @ApiProperty({ example: '08/30' })
  @Length(4, 5)
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 123 })
  @IsInt()
  @Min(100)
  @Max(9999)
  @IsOptional()
  cvv?: number;
}
