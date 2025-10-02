import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorWithDocumentDto } from './create-doctor.dto';

export class UpdateDoctorDto extends PartialType(CreateDoctorWithDocumentDto) {}
