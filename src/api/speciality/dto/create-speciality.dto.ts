import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DoctorSpeciality } from 'src/common/enum';

export class CreateSpecialityDto {
  @ApiProperty({
    example: DoctorSpeciality.PSYCHIATRIST,
  })
  @IsEnum(DoctorSpeciality)
  @IsNotEmpty()
  name: DoctorSpeciality;

  @ApiProperty({
    example: 'Bu soha igna tiqadi',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
