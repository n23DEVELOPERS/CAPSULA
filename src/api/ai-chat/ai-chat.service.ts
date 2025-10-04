// src/api/ai-chat/ai-chat.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateAiChatDto } from './dto/create-ai-chat.dto';
import { UpdateAiChatDto } from './dto/update-ai-chat.dto';
import OpenAI from 'openai';

@Injectable()
export class AiChatService {
  private prisma = new PrismaClient();
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // ✅ Savol yuborish va javob olish
  async create(createAiChatDto: CreateAiChatDto) {
    const { patient_id, question } = createAiChatDto;

    // 1. OpenAI’dan javob olish
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Siz bemorga qaysi shifokorga murojaat qilish kerakligini maslahat beruvchi AI assistantsiz.',
        },
        {
          role: 'user',
          content: `Mening savolim: ${question}`,
        },
      ],
    });

    const answer = response.choices[0].message?.content || 'Aniq javob topilmadi';

    // 2. Natijani DB ga yozish
    return this.prisma.aiChat.create({
      data: {
        patient_id,
        question,
        answer,
      },
    });
  }

  // ✅ Barcha yozuvlarni olish
  async findAll() {
    return this.prisma.aiChat.findMany({
      include: { patient: true }, // bemor haqida ham ma’lumot chiqishi uchun
    });
  }

  // ✅ ID bo‘yicha bitta yozuv olish
  async findOne(id: number) {
    return this.prisma.aiChat.findUnique({
      where: { id },
      include: { patient: true },
    });
  }

  // ✅ Yangilash
  async update(id: number, updateAiChatDto: UpdateAiChatDto) {
    return this.prisma.aiChat.update({
      where: { id },
      data: updateAiChatDto,
    });
  }

  // ✅ O‘chirish
  async remove(id: number) {
    return this.prisma.aiChat.delete({
      where: { id },
    });
  }
}
