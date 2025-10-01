import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  ValidateIf,
  Matches,
  IsEnum,
  IsNumber,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { Wallet_type } from 'src/common/enum';

export class CreateWalletDto {
  @ApiProperty({ example: 'Ali' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '9860 1234 1234 5678' })
  @MaxLength(19)
  @MinLength(12)
  @IsOptional()
  @IsString()
  card_number: string;

  @ApiProperty({ example: 'HUMO' })
  @IsString()
  @IsEnum(Wallet_type)
  type: Wallet_type;

  @ApiProperty({ example: '08/30' })
  @MaxLength(5)
  @MinLength(5)
  @ValidateIf((o) => o.type === 'VISA' || o.type === 'MASTERCARD')
  @IsString()
  date?: string;

  @ApiProperty({ example: 123 })
  @MaxLength(4)
  @MinLength(3)
  @ValidateIf((o) => o.type === 'VISA' || o.type === 'MASTERCARD')
  @Matches(/^\d{3,4}$/, { message: 'cvv must be 3 or 4 digits' })
  cvv?: number;
}
