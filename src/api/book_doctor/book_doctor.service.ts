import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDoctorDto } from './dto/create-book_doctor.dto';
import { UpdateBookDoctorDto } from './dto/update-book_doctor.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Book_doctor, Status } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BookDoctorService extends BaseService<CreateBookDoctorDto, UpdateBookDoctorDto, Book_doctor> {
  constructor(
    protected prisma: PrismaService
  ) {
    super(prisma, prisma.book_doctor, 'book_doktor not fount')
  }


  async checkExists(model: any, id: number, name: string) {
    const record = await model.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException(`${ name } not found`);
    }
  }

  async createBookingWithPayment(dto: CreateBookDoctorDto) {
    return this.prisma.$transaction(async (tx) => {
      // Doctor mavjudligini tekshirish
      const doctor = await tx.doctor.findUnique({
        where: { id: dto.doctorId },
      });
      if (!doctor) throw new NotFoundException('Doctor not found');

      // Patient mavjudligini tekshirish
      const patient = await tx.patient.findUnique({
        where: { id: dto.patient_id },
      });
      if (!patient) throw new NotFoundException('Patient not found');

      // Patient walletini olish
      const patientWallet = await tx.wallet.findUnique({
        where: { patientId: dto.patient_id },
      });
      if (!patientWallet) throw new NotFoundException('Patient wallet not found');

      // Doctor walletini olish
      const doctorWallet = await tx.wallet.findUnique({
        where: { doctorId: dto.doctorId },
      });
      if (!doctorWallet) throw new NotFoundException('Doctor wallet not found');

      // Balans tekshirish
      if (patientWallet.balence < dto.amount) {
        throw new BadRequestException('Not enough balance in patient wallet');
      }


      // Booking yozuvi yaratish
      const booking = await tx.book_doctor.create({
        data: {
          service_id: dto.service_id,
          doctorId: dto.doctorId,
          speciality_id: dto.speciality_id,
          patient_id: dto.patient_id,
          book_date: new Date(dto.book_date),
          status: Status.SUCCESS,
          is_active: true,
          location: dto.location ?? '',
          amount: dto.amount
        },
      });


      //  Patient balansidan ayirish
      await tx.wallet.update({
        where: { id: patientWallet.id },
        data: {
          balence: { decrement: dto.amount },
        },
      });

      //  Doctor balansiga qo‘shish
      await tx.wallet.update({
        where: { id: doctorWallet.id },
        data: {
          balence: { increment: dto.amount },
        },
      });

      // Payment yozuvi yaratish
      const payment = await tx.payment.create({
        data: {
          book_doctor_id: booking.id,
          status: Status.SUCCESS,
          patient_name: patient.first_name,
          doctor_name: doctor.first_name,
          // payment_type: dto.payment_type,
          meeting_date: new Date(dto.book_date),
          description: dto.description ?? '',
        },
      });

      return { booking, payment };
    });
  }

  async cancelBooking(bookingId: number, patientId: number) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Bookingni topamiz
      const booking = await tx.book_doctor.findUnique({
        where: { id: bookingId },
        include: {
          patient: { include: { Wallet: true } },
          doctor: { include: { wallet: true } },
        },
      });

      if (!booking) throw new Error('Booking topilmadi');
      if (booking.patient_id !== patientId) throw new Error('Ruxsat yoq');

      //  Bekor qilish vaqtini hisoblash
      const now = new Date();
      const diffHours =
        (booking.book_date.getTime() - now.getTime()) / (1000 * 60 * 60);
      //  Refund policy
      let refundPercent = 0;
      if (diffHours >= 24) refundPercent = 100;
      else if (diffHours >= 6) refundPercent = 50;
      else if (diffHours >= 1) refundPercent = 20;
      else refundPercent = 0;

      // To‘lanadigan miqdor
      const amount = booking.amount; // booking yaratishda saqlab qo‘yilgan bo‘lishi kerak
      const refundAmount = Math.floor((amount * refundPercent) / 100);

      //  Walletlarda balansni o‘zgartirish
      if (refundAmount > 0) {
        await tx.wallet.update({
          where: { id: booking.doctor.wallet[0].id }, // birinchi walletni olish
          data: { balence: { decrement: refundAmount } },
        });

        await tx.wallet.update({
          where: { id: booking.patient.Wallet[0].id }, // birinchi walletni olish
          data: { balence: { increment: refundAmount } },
        });
      }

      // 5. Booking statusini yangilash
      await tx.book_doctor.update({
        where: { id: bookingId },
        data: {
          status: Status.CANCELLED,
          is_active: false,
        },
      });

      // 6. Payment yozuvini yangilash
      await tx.payment.updateMany({
        where: { book_doctor_id: bookingId },
        data: {
          status:
            refundPercent === 100
              ? Status.SUCCESS
              : refundPercent > 0
                ? Status.PARTIAL_REFUND
                : Status.NOT_REFUNDABLE,
          description: `Bekor qilindi.Refund: ${ refundPercent } %`,
        },
      });

      return {
  message: `Booking bekor qilindi.Refund ${ refundPercent }%`,
    refundAmount,
      };
    });
  }

}