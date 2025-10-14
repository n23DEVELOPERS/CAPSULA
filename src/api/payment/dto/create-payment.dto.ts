import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Payment_type } from 'src/common/enum';

export class CreatePaymentDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  book_doctor_id: number;

  @ApiProperty({
    example: Payment_type.CARD,
  })
  @IsEnum(Payment_type)
  @IsNotEmpty()
  payment_type: Payment_type;

  @ApiProperty({
    example: 'Shunchaki alo darajada yozilgan kod',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
