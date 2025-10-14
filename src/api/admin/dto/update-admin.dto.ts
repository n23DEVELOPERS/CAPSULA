import { PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Roles } from 'src/common/enum';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @IsEnum(Roles)
  @IsOptional()
  role?: Roles = Roles.ADMIN;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
