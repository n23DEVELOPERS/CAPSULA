// src/api/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  private prisma = new PrismaClient();

  // 🟢 CREATE — bemor doktorga baho berish
  async create(dto: CreateChatDto) {
    return this.prisma.chat.create({
      data: {
        rating: dto.rating,
        comments: dto.comments,
        complaint: dto.complaint ?? 'PENDING',
        doctor_id: dto.doctor_id,
        patient_id: dto.patient_id,
      },
      include: {
        doctor: true,
        patient: true,
      },
    });
  }

  // 🟢 GET ALL
  async findAll() {
    return this.prisma.chat.findMany({
      include: {
        doctor: true,
        patient: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  // 🟢 GET BY ID
  async findOne(id: number) {
    return this.prisma.chat.findUnique({
      where: { id },
      include: {
        doctor: true,
        patient: true,
      },
    });
  }

  // 🟢 UPDATE
  async update(id: number, dto: UpdateChatDto) {
    return this.prisma.chat.update({
      where: { id },
      data: dto,
      include: {
        doctor: true,
        patient: true,
      },
    });
  }

  // 🟢 DELETE
  async remove(id: number) {
    return this.prisma.chat.delete({
      where: { id },
    });
  }
}
