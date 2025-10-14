import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSpecialityDto } from './create-speciality.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSpecialityDto extends PartialType(CreateSpecialityDto) {
  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
