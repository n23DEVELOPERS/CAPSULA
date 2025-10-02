import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Payment } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { successRes } from 'src/infrastructure/response/success';
import { Status } from 'src/common/enum';

@Injectable()
export class PaymentService extends BaseService<
  CreatePaymentDto,
  UpdatePaymentDto,
  Payment
> {
  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.payment, 'payment not fount');
  }

  async checkExists(model: any, id: number, name: string) {
    const record = await model.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException(`${name} not found`);
    }
    return record;
  }

  async createPayment(createPaymentDto: CreatePaymentDto & { amount: number }) {
    const {
      book_doctor_id,
      pateints_name,
      doctor_name,
      payment_type,
      description,
      meeting_date,
      amount,
    } = createPaymentDto;

    const bookDoctor = await this.checkExists(
      this.prisma.book_doctor,
      book_doctor_id,
      'Book_doctor',
    );

    const doctorWallet = await this.prisma.wallet.findFirst({
      where: { user_id: bookDoctor.doctor_id },
    });
    if (!doctorWallet) throw new NotFoundException('Doctor Wallet not found');

    const patientWallet = await this.prisma.wallet.findFirst({
      where: { user_id: bookDoctor.patient_id },
    });
    if (!patientWallet) throw new NotFoundException('Patient Wallet not found');

    // trnaszaksiya boshlani
    const result = await this.prisma.$transaction(async (tx) => {
      let paymentStatus: Status;
      if (patientWallet.balence < amount) {
        paymentStatus = Status.CANCELLED;
        // book_doctor statusni CANCELLED qilish
        await tx.book_doctor.update({
          where: { id: book_doctor_id },
          data: { status: Status.CANCELLED },
        });
        return {
          message: 'Patient balance insufficient',
          status: paymentStatus,
        };
      }
      paymentStatus = Status.SUCCESS;
      const payment = await tx.payment.create({
        data: {
          book_doctor_id,
          patient_name: pateints_name,
          doctor_name,
          payment_type,
          description: description || '',
          meeting_date,
          status: paymentStatus,
        },
      });
      await tx.book_doctor.update({
        where: { id: book_doctor_id },
        data: { status: paymentStatus },
      });
      await tx.wallet.update({
        where: { id: patientWallet.id },
        data: { balence: { decrement: amount } },
      });
      await tx.wallet.update({
        where: { id: doctorWallet.id },
        data: { balence: { increment: amount } },
      });
      return payment;
    });
    return successRes(result, 201);
  }

  // findAllPayment() {
  //   return `This action returns all payment`;
  // }

  // findOnePayment(id: number) {
  //   return `This action returns a #${id} payment`;
  // }

  updatePayment(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  // deletePayment(id: number) {
  //   return `This action removes a #${id} payment`;
  // }
}
