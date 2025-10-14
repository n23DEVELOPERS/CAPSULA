import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Payment } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { successRes } from 'src/infrastructure/response/success';
import { PaymentStatus, BookDoctorStatus } from 'src/common/enum';
import { config } from 'src/config';
import { TokenService } from 'src/infrastructure/token/Token';

@Injectable()
export class PaymentService extends BaseService<
  CreatePaymentDto,
  UpdatePaymentDto,
  Payment
> {
  constructor(
    protected prisma: PrismaService,
    private readonly token: TokenService,
  ) {
    super(prisma, prisma.payment, 'payment not fount');
  }

  async checkExists(model: any, id: number, name: string) {
    const record = await model.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException(`${name} not found`);
    }
    return record;
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
    const { book_doctor_id, payment_type, description } = createPaymentDto;

    const bookDoctor = await this.prisma.book_doctor.findUnique({
      where: { id: book_doctor_id },
      include: { service: true },
    });
    if (!bookDoctor) throw new NotFoundException('Book_doctor not found');

    if (
      bookDoctor.status === BookDoctorStatus.CANCELLED ||
      bookDoctor.status === BookDoctorStatus.PENDING
    ) {
      throw new ConflictException('Invalid status');
    }

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: bookDoctor.doctor_id },
      include: { speciality: true },
    });
    if (!doctor || !doctor.is_active)
      throw new NotFoundException('Doctor not found or inactive');

    const service = await this.prisma.service.findUnique({
      where: { id: bookDoctor.service_id },
      include: { doctor: true },
    });
    if (!service) throw new NotFoundException('Service not found');

    const patient = await this.prisma.patient.findUnique({
      where: { id: bookDoctor.patient_id },
    });
    if (!patient) throw new NotFoundException('Patient not found');

    const doctorWallet = await this.prisma.wallet.findFirst({
      where: { doctor_id: bookDoctor.doctor_id },
    });
    if (!doctorWallet) throw new NotFoundException('Doctor Wallet not found');

    const patientWallet = await this.prisma.wallet.findFirst({
      where: { patient_id: bookDoctor.patient_id },
    });
    if (!patientWallet) throw new NotFoundException('Patient Wallet not found');

    const servicePrice = Number(bookDoctor.service.price);

    const result = await this.prisma.$transaction(async (tx) => {
      let paymentStatus: PaymentStatus;

      if (patientWallet.balence < servicePrice) {
        throw new BadRequestException('Not enough funds in balance');
      }
      paymentStatus = PaymentStatus.PAID;

      const payment = await tx.payment.create({
        data: {
          book_doctor_id,
          patient_name: patient.first_name,
          doctor_name: doctor.first_name,
          payment_type,
          description: description || '',
          meeting_date: bookDoctor.book_date,
          status: paymentStatus,
        },
      });

      await tx.book_doctor.update({
        where: { id: book_doctor_id },
        data: { is_active: true },
      });

      await tx.wallet.update({
        where: { id: patientWallet.id },
        data: { balence: { decrement: servicePrice } },
      });

      await tx.wallet.update({
        where: { id: doctorWallet.id },
        data: { balence: { increment: servicePrice } },
      });

      return payment;
    });

    return successRes(result, 201);
  }

  async updatePayment(
    id: number,
    token: string,
    updatePaymentDto: UpdatePaymentDto,
  ) {
    const { book_doctor_id, payment_type, description } = updatePaymentDto;

    const decoded: any = await this.token.verifyToken(
      token,
      config.TOKEN.REFRESH_KEY,
    );

    const oldPayment = await this.prisma.payment.findUnique({ where: { id } });
    if (!oldPayment) throw new NotFoundException('Payment not found');

    const bookDoctor = await this.prisma.book_doctor.findUnique({
      where: { id: book_doctor_id },
      include: { service: true },
    });
    if (!bookDoctor) throw new NotFoundException('Book_doctor not found');

    const servicePrice = Number(bookDoctor.service.price);

    const doctorWallet = await this.prisma.wallet.findFirst({
      where: { doctor_id: bookDoctor.doctor_id },
    });
    if (!doctorWallet) throw new NotFoundException('Doctor Wallet not found');

    const patientWallet = await this.prisma.wallet.findFirst({
      where: { patient_id: bookDoctor.patient_id },
    });
    if (!patientWallet) throw new NotFoundException('Patient Wallet not found');

    const result = await this.prisma.$transaction(async (tx) => {
      const oldBookDoctor = await tx.book_doctor.findUnique({
        where: { id: oldPayment.book_doctor_id },
        include: { service: true },
      });
      const oldServicePrice = oldBookDoctor
        ? Number(oldBookDoctor.service.price)
        : 0;

      await tx.wallet.update({
        where: { id: doctorWallet.id },
        data: { balence: { decrement: oldServicePrice } },
      });

      await tx.wallet.update({
        where: { id: patientWallet.id },
        data: { balence: { increment: oldServicePrice } },
      });

      const refreshedPatient = await tx.wallet.findUnique({
        where: { id: patientWallet.id },
      });

      if (!refreshedPatient) {
        throw new NotFoundException('Patient Wallet not found after refresh');
      }

      if (
        bookDoctor.status === BookDoctorStatus.SUCCESS ||
        bookDoctor.status === BookDoctorStatus.PENDING
      ) {
        throw new BadRequestException('Bad request');
      }

      if (refreshedPatient.balence < servicePrice) {
        await tx.book_doctor.update({
          where: { id: book_doctor_id },
          data: { is_active: false },
        });
        return {
          message: 'Patient balance insufficient',
          status: BookDoctorStatus.CANCELLED,
        };
      }

      const updatedPayment = await tx.payment.update({
        where: { id },
        data: {
          book_doctor_id,
          payment_type,
          description: description || '',
          status: PaymentStatus.CANCELLED,
        },
      });

      await tx.wallet.update({
        where: { id: patientWallet.id },
        data: { balence: { decrement: servicePrice } },
      });

      await tx.wallet.update({
        where: { id: doctorWallet.id },
        data: { balence: { increment: servicePrice } },
      });

      await tx.book_doctor.update({
        where: { id: book_doctor_id },
        data: { status: BookDoctorStatus.CANCELLED },
      });

      return updatedPayment;
    });

    return successRes(result, 200);
  }
}
