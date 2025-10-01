import { Module } from '@nestjs/common';
import { BookDoctorService } from './book_doctor.service';
import { BookDoctorController } from './book_doctor.controller';

@Module({
  controllers: [BookDoctorController],
  providers: [BookDoctorService],
})
export class BookDoctorModule {}
