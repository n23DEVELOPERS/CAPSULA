// src/api/ai-chat/ai-chat.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AiChatService } from './ai-chat.service';
import { CreateAiChatDto } from './dto/create-ai-chat.dto';
import { UpdateAiChatDto } from './dto/update-ai-chat.dto';

@ApiTags('AI Chat')
@Controller('ai-chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  // ✅ Bemor savol beradi va AI javob qaytaradi
  @Post()
  @ApiOperation({ summary: 'AI ga savol berish' })
  @ApiResponse({ status: 201, description: 'AI javobini qaytaradi' })
  async create(@Body() createAiChatDto: CreateAiChatDto) {
    return this.aiChatService.create(createAiChatDto);
  }

  // ✅ Barcha AI maslahatlarini olish
  @Get()
  @ApiOperation({ summary: 'Barcha AI maslahatlarini olish' })
  async findAll() {
    return this.aiChatService.findAll();
  }

  // ✅ Bitta yozuvni olish
  @Get(':id')
  @ApiOperation({ summary: 'ID bo‘yicha bitta maslahatni olish' })
  async findOne(@Param('id') id: string) {
    return this.aiChatService.findOne(+id);
  }

  // ✅ Yozuvni yangilash
  @Put(':id')
  @ApiOperation({ summary: 'Maslahatni yangilash' })
  async update(
    @Param('id') id: string,
    @Body() updateAiChatDto: UpdateAiChatDto,
  ) {
    return this.aiChatService.update(+id, updateAiChatDto);
  }

  // ✅ Yozuvni o‘chirish
  @Delete(':id')
  @ApiOperation({ summary: 'Maslahatni o‘chirish' })
  async remove(@Param('id') id: string) {
    return this.aiChatService.remove(+id);
  }
}
