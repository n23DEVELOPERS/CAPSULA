import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { BookDoctorModule } from './book_doctor/book_doctor.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [PrismaModule, BookDoctorModule, PaymentModule],
})
export class AppModule {}
