import { IsNotEmpty, IsUUID, IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { Complaint, Payment_type } from 'src/common/enum';

export class CreatePaymentDto {
  @IsNotEmpty()
  book_doctor_id: number;

  @IsEnum(Complaint)
  @IsNotEmpty()
  status: Complaint;

  @IsString()
  @IsNotEmpty()
  pateints_name: string;

  @IsString()
  @IsNotEmpty()
  doctor_name: string;

  @IsEnum(Payment_type)
  @IsNotEmpty()
  payment_type: Payment_type;

  @IsDateString()
  @IsNotEmpty()
  meeting_date: Date;

  @IsString()
  @IsOptional()
  description?: string;
}