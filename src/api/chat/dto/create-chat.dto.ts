import { IsString, IsOptional, IsEnum, IsNotEmpty, MaxLength } from 'class-validator';

export enum ChatRating {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

export enum ChatComplaint {
  RUDE_BEHAVIOR = 'rude_behavior',
  LATE_RESPONSE = 'late_response',
  WRONG_DIAGNOSIS = 'wrong_diagnosis',
  UNPROFESSIONAL = 'unprofessional',
  OTHER = 'other',
}

export class CreateChatDto {
  @IsString()
  @IsNotEmpty()
  doctor_id: string;

  @IsString()
  @IsNotEmpty()
  pateint_id: string;

  @IsOptional()
  @IsEnum(ChatRating, { message: 'Rating 1 dan 5 gacha bo\'lishi kerak' })
  rating?: ChatRating;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Sharh 500 ta belgidan oshmasligi kerak' })
  comments?: string;

  @IsOptional()
  @IsEnum(ChatComplaint, { message: 'Noto\'g\'ri shikoyat turi' })
  complaint?: ChatComplaint;
}