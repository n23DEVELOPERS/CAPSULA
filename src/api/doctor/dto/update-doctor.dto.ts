import { PartialType } from '@nestjs/swagger';
import { CreateDoctorWithDocumentDto } from './create-doctor.dto';

export class UpdateDoctorDto extends PartialType(CreateDoctorWithDocumentDto) {}
