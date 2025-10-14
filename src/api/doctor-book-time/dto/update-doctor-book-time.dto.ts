import { PartialType } from '@nestjs/swagger';
import { CreateDoctorBookTimeDto } from './create-doctor-book-time.dto';

export class UpdateDoctorBookTimeDto extends PartialType(
  CreateDoctorBookTimeDto,
) {}
