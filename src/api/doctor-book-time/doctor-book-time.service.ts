import { Injectable } from '@nestjs/common';
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

  async createBookTime(token: string, dto: CreateDoctorBookTimeDto) {
    const data: any = this.jwt.verifyToken(token, config.TOKEN.REFRESH_KEY);
    const doctorId = data.id;

    const booke_time = this.prisma.doctor_book_time.create({
      data: {
        doctorId,
        start_time: dto.start_time,
        end_time: dto.finish_time,
        date: dto.date,
      },
    });

    return successRes(booke_time, 201);
  }
}
