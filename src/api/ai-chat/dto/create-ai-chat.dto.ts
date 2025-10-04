import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAiChatDto {
  @ApiProperty({
    example: 1,
    description: 'Bemor (patient) ID',
  })
  @IsInt()
  patient_id: number;

  @ApiProperty({
    example: 'Menda bosh og‘rig‘i bor, qaysi shifokorga murojaat qilishim kerak?',
    description: 'Bemor tomonidan berilgan savol',
  })
  @IsString()
  question: string;
}
