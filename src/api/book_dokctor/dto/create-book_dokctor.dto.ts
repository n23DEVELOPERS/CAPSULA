import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsBoolean,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { Status } from 'src/common/enum';

export class CreateBookDoctorDto {
  @IsNotEmpty()
  service_id: number;

  @IsNotEmpty()
  doctor_id: number;

  @IsNotEmpty()
  speciality_id: number;

  @IsNotEmpty()
  patient_id: number;

  @IsDateString()
  @IsNotEmpty()
  book_date: Date;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = false;

  @IsEnum(Status)
  @IsOptional()
  status?: Status = Status.PENDING;

  @IsString()
  @IsOptional()
  location?: string;
}
