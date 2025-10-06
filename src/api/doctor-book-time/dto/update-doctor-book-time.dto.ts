import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorBookTimeDto } from './create-doctor-book-time.dto';

export class UpdateDoctorBookTimeDto extends PartialType(CreateDoctorBookTimeDto) {}
