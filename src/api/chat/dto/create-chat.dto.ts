// src/api/chat/dto/create-chat.dto.ts
import { IsEnum, IsInt, IsString, IsOptional } from 'class-validator';
import { Rating, Complaint } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({ enum: Rating, example: Rating.FIVE })
  @IsEnum(Rating)
  rating: Rating;

  @ApiProperty({ example: 'Doktor juda yaxshi tushuntirdi.' })
  @IsString()
  comments: string;

  @ApiProperty({ enum: Complaint, example: Complaint.PENDING })
  @IsEnum(Complaint)
  @IsOptional()
  complaint?: Complaint;

  @ApiProperty({ example: 1 })
  @IsInt()
  doctor_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  patient_id: number;
}
