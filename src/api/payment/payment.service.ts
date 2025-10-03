import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Payment, Status } from '@prisma/client';
import { BaseService } from 'src/infrastructure/base/base.service';

@Injectable()
export class PaymentService extends BaseService<CreatePaymentDto, UpdatePaymentDto, Payment> {

  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.payment, 'payment not fount')
  }

  async createPayment(dto: CreatePaymentDto) {
    return this.prisma.$transaction(async (tx) => {
      // Booking mavjudligini tekshirish
      const booking = await tx.book_doctor.findUnique({
        where: { id: dto.book_doctor_id },
      });
      if (!booking) throw new NotFoundException('Booking not found');
  
      // Patient va Doctor ma'lumotlarini olish
      const patient = await tx.patient.findUnique({
        where: { id: booking.patient_id },
      });
      if (!patient) throw new NotFoundException('Patient not found');
  
      const doctor = await tx.doctor.findUnique({
        where: { id: booking.doctorId },
      });
      if (!doctor) throw new NotFoundException('Doctor not found');
  
      // Patient wallet
      const patientWallet = await tx.wallet.findUnique({
        where: { patientId: patient.id },
      });
      if (!patientWallet) throw new NotFoundException('Patient wallet not found');
  
      // 4. Doctor wallet
      const doctorWallet = await tx.wallet.findUnique({
        where: { doctorId: doctor.id },
      });
      if (!doctorWallet) throw new NotFoundException('Doctor wallet not found');
  
      // 5. Balans tekshirish
      if (patientWallet.balence < booking.amount) {
        throw new BadRequestException('Not enough balance in patient wallet');
      }
  
      // 6. Patient balansidan ayirish
      await tx.wallet.update({
        where: { id: patientWallet.id },
        data: { balence: { decrement: booking.amount } },
      });
  
      // 7. Doctor balansiga qo‘shish
      await tx.wallet.update({
        where: { id: doctorWallet.id },
        data: { balence: { increment: booking.amount } },
      });
  
      // 8. Payment yaratish
      const payment = await tx.payment.create({
        data: {
          book_doctor_id: booking.id,
          status: Status.SUCCESS,
          patient_name: patient.first_name,
          doctor_name: doctor.first_name,
          meeting_date: booking.book_date,
          description: dto.description ?? '',
        },
      });
  
      return payment;
    });
  }

  
  
}
