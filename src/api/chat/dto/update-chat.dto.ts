import { PartialType } from '@nestjs/swagger';
import { CreateChatDto } from './create-chat.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateChatDto extends PartialType(CreateChatDto) {}
