import { PartialType } from '@nestjs/swagger';
import { CreateWalletDto } from './create-wallet.dto';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {
  @IsOptional()
  @Min(0)
  @IsNumber()
  balence?: number;
}
