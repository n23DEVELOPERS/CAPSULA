import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ComplaintType } from '@prisma/client'

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: 'create chat'})
  @Post('chat')
  createChat(@Body() CreateChatDto: CreateChatDto){
    return this.chatService.create(CreateChatDto, ComplaintType.CHAT)
  }
}
