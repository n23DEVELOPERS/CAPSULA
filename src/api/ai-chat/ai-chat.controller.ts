import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { AiChatService } from './ai-chat.service';
import { CreateAiChatDto } from './dto/create-ai-chat.dto';
import { UpdateAiChatDto } from './dto/update-ai-chat.dto';

@Controller('ai-chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Post()
  async create(@Body() createAiChatDto: CreateAiChatDto) {
    return this.aiChatService.create(createAiChatDto);
  }

  @Get()
  async findAll() {
    return this.aiChatService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.aiChatService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAiChatDto: UpdateAiChatDto,
  ) {
    return this.aiChatService.update(id, updateAiChatDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.aiChatService.remove(id);
  }
}
