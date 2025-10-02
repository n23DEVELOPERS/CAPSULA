import { PartialType } from '@nestjs/swagger';
import { CreatePatientDto } from './create-patient.dto';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Roles } from 'src/common/enum';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  @IsEnum(Roles)
  @IsOptional()
  role?: Roles;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
