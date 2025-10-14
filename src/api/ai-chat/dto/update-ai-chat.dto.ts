import { PartialType } from '@nestjs/mapped-types';
import { CreateAiChatDto } from './create-ai-chat.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAiChatDto extends PartialType(CreateAiChatDto) {
  @ApiPropertyOptional({
    example: 'AI javobini yangilash',
    description:
      'AI tomonidan qaytarilgan javob (faqat admin yoki sistema ozgartirishi mumkin)',
  })
  @IsOptional()
  @IsString()
  answer?: string;
}
