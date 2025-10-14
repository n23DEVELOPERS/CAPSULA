import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorBookTimeDto } from './dto/create-doctor-book-time.dto';
import { UpdateDoctorBookTimeDto } from './dto/update-doctor-book-time.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Doctor_book_time } from '@prisma/client';
import { successRes } from 'src/infrastructure/response/success';
import { TokenService } from 'src/infrastructure/token/Token';
import { config } from 'src/config';

@Injectable()
export class DoctorBookTimeService extends BaseService<
  CreateDoctorBookTimeDto,
  UpdateDoctorBookTimeDto,
  Doctor_book_time
> {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly jwt: TokenService,
  ) {
    super(prisma, prisma.doctor_book_time, 'Bookt time not found');
  }

  parseDate(dateStr?: string) {
    if (!dateStr) return null;

    const parts = dateStr.split('.');
    if (parts.length !== 3) return null;

    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }

  async createBookTime(token: string, dto: CreateDoctorBookTimeDto) {
    const data: any = await this.jwt.verifyToken(
      token,
      config.TOKEN.REFRESH_KEY,
    );
    const doctorId = data.id;
    const parsedDate = this.parseDate(dto.date);

    console.log('decoded token:', data);

    const booke_time = await this.prisma.doctor_book_time.create({
      data: {
        doctor_id: doctorId,
        date: parsedDate ? new Date(parsedDate) : null,
      },
    });

    return successRes(booke_time, 201);
  }

  async updateBookTime(
    token: string,
    id: number,
    dto: UpdateDoctorBookTimeDto,
  ) {
    // Tokenni tekshirish
    const data: any = await this.jwt.verifyToken(
      token,
      config.TOKEN.REFRESH_KEY,
    );
    const doctorId = data.id;

    // Sanani formatlash
    const parsedDate = this.parseDate(dto.date);

    console.log('decoded token:', data);

    // Avvalo mavjud yozuvni tekshiramiz
    const existingBookTime = await this.prisma.doctor_book_time.findUnique({
      where: { id },
    });

    if (!existingBookTime) {
      throw new NotFoundException('Book time not found');
    }

    // Yozuvni yangilaymiz
    const updatedBookTime = await this.prisma.doctor_book_time.update({
      where: { id },
      data: {
        doctor_id: doctorId,
        date: parsedDate ? new Date(parsedDate) : existingBookTime.date,
        is_active: dto.is_active,
      },
    });

    return successRes(updatedBookTime, 200);
  }
}
