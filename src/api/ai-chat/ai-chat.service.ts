import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateAiChatDto } from './dto/create-ai-chat.dto';
import { UpdateAiChatDto } from './dto/update-ai-chat.dto';
import OpenAI from 'openai';
import { successRes } from 'src/infrastructure/response/success';

@Injectable()
export class AiChatService {
  private prisma = new PrismaClient();
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async create(createAiChatDto: CreateAiChatDto) {
    const { patient_id, question } = createAiChatDto;

    const patient = await this.prisma.patient.findUnique({
      where: { id: patient_id },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Siz bemorga qaysi shifokorga murojaat qilish kerakligini maslahat beruvchi AI assistantsiz.',
        },
        {
          role: 'user',
          content: `Mening savolim: ${question}`,
        },
      ],
    });

    const answer =
      response.choices[0].message?.content || 'Aniq javob topilmadi';

    return this.prisma.aiChat.create({
      data: {
        patient_id,
        question,
        answer,
      },
    });
  }

  async findAll() {
    return this.prisma.aiChat.findMany({
      include: { patient: true },
    });
  }

  async findOne(id: number) {
    const AiChat = await this.prisma.aiChat.findUnique({
      where: { id },
      include: { patient: true },
    });
    if (!AiChat) {
      throw new NotFoundException('AI chat not found');
    }
    return successRes(AiChat);
  }

  async update(id: number, updateAiChatDto: UpdateAiChatDto) {
    await this.findOne(id);
    return this.prisma.aiChat.update({
      where: { id },
      data: updateAiChatDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.aiChat.delete({
      where: { id },
    });
    return successRes({})
  }
}
