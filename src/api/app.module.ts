import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { BookDoctorModule } from './book_doctor/book_doctor.module';

@Module({
  imports: [PrismaModule, BookDoctorModule],
})
export class AppModule {}
