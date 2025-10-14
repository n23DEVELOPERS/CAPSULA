import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { successRes } from 'src/infrastructure/response/success';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async checkExists(model: any, id: number, name: string) {
    const record = await model.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException(`${name} not found`);
    }
    return record;
  }

  async create(dto: CreateChatDto) {
    const { doctor_id, patient_id } = dto;
    await this.checkExists(this.prisma.doctor, doctor_id, 'Doctor');
    await this.checkExists(this.prisma.patient, patient_id, 'Patient');
    const mess = await this.prisma.chat.create({ data: dto });
    return successRes(mess, 201);
  }

  async findAll(doctor_id: number, patient_id: number) {
    await this.checkExists(this.prisma.doctor, doctor_id, 'Doctor');
    await this.checkExists(this.prisma.patient, patient_id, 'Patient');
    const messages = await this.prisma.chat.findMany({
      where: { doctor_id, patient_id },
      orderBy: { sent_at: 'asc' },
    });
    return successRes(messages);
  }

  async update(id: number, dto: UpdateChatDto) {
    const existing = await this.prisma.chat.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Chat message not found');
    if (dto.doctor_id) {
      await this.checkExists(this.prisma.doctor, dto.doctor_id, 'Doctor');
    }
    if (dto.patient_id) {
      await this.checkExists(this.prisma.patient, dto.patient_id, 'Patient');
    }
    const updated = await this.prisma.chat.update({
      where: { id },
      data: dto,
    });
    return successRes(updated);
  }

  async remove(id: number) {
    const existing = await this.prisma.chat.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Chat message not found');
    await this.prisma.chat.delete({ where: { id } });
    return successRes({});
  }
}
