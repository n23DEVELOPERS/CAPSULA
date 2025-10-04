// src/api/chat/dto/update-chat.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateChatDto } from './create-chat.dto';

export class UpdateChatDto extends PartialType(CreateChatDto) {}
