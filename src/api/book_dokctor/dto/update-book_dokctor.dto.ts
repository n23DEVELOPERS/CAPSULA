import { PartialType } from '@nestjs/swagger';
import { CreateBookDoctorDto } from './create-book_dokctor.dto';

export class UpdateBookDokctorDto extends PartialType(CreateBookDoctorDto) {}
