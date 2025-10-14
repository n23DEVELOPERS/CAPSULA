import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAiChatDto {
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  patient_id: number;

  @ApiProperty({
    example: 'Menda bosh ogrigi bor, qaysi shifokorga murojaat qilishim kerak?',
  })
  @IsString()
  question: string;
}
