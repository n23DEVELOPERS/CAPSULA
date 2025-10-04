// src/api/chat/chat.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Chat (Doctor Reviews)')
@Controller('api/v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Bemor doktorga baho va izoh qoldiradi' })
  @ApiResponse({ status: 201, description: 'Baholash muvaffaqiyatli yaratildi' })
  create(@Body() dto: CreateChatDto) {
    return this.chatService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha baholarni olish' })
  findAll() {
    return this.chatService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta bahoni olish' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Bahoni tahrirlash' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateChatDto) {
    return this.chatService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Bahoni o‘chirish' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.remove(id);
  }
}
