import { PartialType } from '@nestjs/swagger';
import { CreateBookDoctorDto } from './create-book_doctor.dto';

export class UpdateBookDoctorDto extends PartialType(CreateBookDoctorDto) {}
