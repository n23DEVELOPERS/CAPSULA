import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDoctorDto } from './dto/create-book_doctor.dto';
import { UpdateBookDoctorDto } from './dto/update-book_doctor.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Book_doctor, Status } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { RescheduleBookingDto } from './dto/reschedule-book_doctor.dto';
import { CancelBookingDto } from './dto/cancel-book_doctor.dto';

@Injectable()
export class BookDoctorService extends BaseService<CreateBookDoctorDto, UpdateBookDoctorDto, Book_doctor> {
  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.book_doctor, 'book_doctor not found');
  }

  async checkExists(model: any, id: number, name: string) {
    const record = await model.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException(`${name} not found`);
    }
  }

 
  // Yangi booking va payment yaratish
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

      // Service va price olish
      const service = await tx.service.findUnique({
        where: { id: dto.service_id },
      });
      if (!service) throw new NotFoundException('Service not found');

      const price = Number(service.price);

      // Patient walletini olish
      const patientWallet = await tx.wallet.findFirst({
        where: { patientId: dto.patient_id },
      });
      if (!patientWallet) throw new NotFoundException('Patient wallet not found');

      // Doctor walletini olish
      const doctorWallet = await tx.wallet.findFirst({
        where: { doctorId: dto.doctorId },
      });
      if (!doctorWallet) throw new NotFoundException('Doctor wallet not found');

      // Balans tekshirish
      if (patientWallet.balence < price) {
        throw new BadRequestException('Not enough balance in patient wallet');
      }

      // Booking yozuvi yaratish (pending)
      const booking = await tx.book_doctor.create({
        data: {
          service_id: dto.service_id,
          doctorId: dto.doctorId,
          speciality_id: dto.speciality_id,
          patient_id: dto.patient_id,
          book_date: new Date(dto.book_date),
          status: Status.PENDING,
          is_active: true,
          location: dto.location ?? '',
        },
      });

      // Patient balansidan ayirish
      await tx.wallet.update({
        where: { id: patientWallet.id },
        data: { balence: { decrement: price } },
      });

      // Doctor balansiga qo‘shish
      await tx.wallet.update({
        where: { id: doctorWallet.id },
        data: { balence: { increment: price } },
      });

      // Payment yozuvi yaratish
      const payment = await tx.payment.create({
        data: {
          book_doctor_id: booking.id,
          status: Status.SUCCESS,
          patient_name: patient.first_name,
          doctor_name: doctor.first_name,
          meeting_date: new Date(dto.book_date),
          description: dto.description ?? '',
        },
      });

      // Booking statusni update qilish
      const updatedBooking = await tx.book_doctor.update({
        where: { id: booking.id },
        data: { status: Status.SUCCESS },
      });

      return { booking: updatedBooking, payment };
    });
  }


  // Bookingni bekor qilish
  async cancelBooking(dto: CancelBookingDto) {
    const { bookingId, patientId } = dto;

    return this.prisma.$transaction(async (tx) => {
      // Bookingni topish
      const booking = await tx.book_doctor.findUnique({
        where: { id: bookingId },
        include: {
          patient: { include: { Wallet: true } },
          doctor: { include: { wallet: true } },
          service: true,
        },
      });

      if (!booking) throw new NotFoundException('Booking not found');
      if (booking.patient_id !== patientId) throw new BadRequestException('Ruxsat yo‘q');

      // Bekor qilish vaqtini hisoblash
      const now = new Date();
      const diffHours =
        (booking.book_date.getTime() - now.getTime()) / (1000 * 60 * 60);

      // Refund policy
      let refundPercent = 0;
      if (diffHours >= 24) refundPercent = 100;
      else if (diffHours >= 6) refundPercent = 50;
      else if (diffHours >= 1) refundPercent = 20;
      else refundPercent = 0;

      const price = Number(booking.service.price);
      const refundAmount = Math.floor((price * refundPercent) / 100);

      // Walletlarni yangilash
      if (refundAmount > 0) {
        await tx.wallet.update({
          where: { id: booking.doctor.wallet[0].id },
          data: { balence: { decrement: refundAmount } },
        });

        await tx.wallet.update({
          where: { id: booking.patient.Wallet[0].id },
          data: { balence: { increment: refundAmount } },
        });
      }

      // Booking statusini yangilash
      await tx.book_doctor.update({
        where: { id: bookingId },
        data: { status: Status.CANCELLED, is_active: false },
      });

      // Payment update qilish
      await tx.payment.updateMany({
        where: { book_doctor_id: bookingId },
        data: {
          status:
            refundPercent === 100
              ? Status.SUCCESS
              : refundPercent > 0
              ? Status.PARTIAL_REFUND
              : Status.NOT_REFUNDABLE,
          description: `Bekor qilindi. Refund: ${refundPercent}%`,
        },
      });

      return {
        message: `Booking bekor qilindi. Refund ${refundPercent}%`,
        refundAmount,
      };
    });
  }

  
  // Bookingni boshqa sanaga o‘tkazish (reschedule)
  
  async rescheduleBooking(dto: RescheduleBookingDto) {
    const { bookingId, patientId, newDate } = dto;

    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.book_doctor.findUnique({
        where: { id: bookingId },
        include: {
          patient: { include: { Wallet: true } },
          doctor: { include: { wallet: true } },
          service: true,
        },
      });
      if (!booking) throw new NotFoundException('Booking not found');

      if (booking.patient_id !== patientId) {
        throw new BadRequestException('Ruxsat yo‘q');
      }

      const patientWallet = booking.patient.Wallet[0];
      const doctorWallet = booking.doctor.wallet[0];
      if (!patientWallet) throw new NotFoundException('Patient wallet not found');
      if (!doctorWallet) throw new NotFoundException('Doctor wallet not found');

      const now = new Date();
      const hoursLeft =
        (booking.book_date.getTime() - now.getTime()) / (1000 * 60 * 60);

      let fee = 0;
      const price = Number(booking.service.price);

      // Reschedule fee policy
      if (hoursLeft < 3) {
        fee = Math.floor(price * 0.15); // 15% fee
        if (patientWallet.balence < fee) {
          throw new BadRequestException('Not enough balance to reschedule');
        }

        await tx.wallet.update({
          where: { id: patientWallet.id },
          data: { balence: { decrement: fee } },
        });
        await tx.wallet.update({
          where: { id: doctorWallet.id },
          data: { balence: { increment: fee } },
        });

        await tx.payment.create({
          data: {
            book_doctor_id: booking.id,
            status: Status.SUCCESS,
            patient_name: booking.patient.first_name,
            doctor_name: booking.doctor.first_name,
            meeting_date: newDate,
            description: `Reschedule fee: ${fee}`,
          },
        });
      }

      // Sana yangilash
      const updatedBooking = await tx.book_doctor.update({
        where: { id: bookingId },
        data: { book_date: newDate },
      });

      return {
        message: `Booking rescheduled successfully${
          fee > 0 ? ` with fee ${fee}` : ''
        }`,
        booking: updatedBooking,
        feeCharged: fee,
      };
    });
  }
}
