import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BookDoctorService } from './book_doctor.service';
import { CreateBookDoctorDto } from './dto/create-book_doctor.dto';
import { UpdateBookDoctorDto } from './dto/update-book_doctor.dto';
import { CancelBookingDto } from './dto/cancel-book_doctor.dto';
import { RescheduleBookingDto } from './dto/reschedule-book_doctor.dto';

@Controller('book-doctor')
export class BookDoctorController {
  constructor(private readonly bookDoctorService: BookDoctorService) { }



  @Post()
  create(@Body() createBookDokctorDto: CreateBookDoctorDto) {
    return this.bookDoctorService.createBookingWithPayment(createBookDokctorDto);
  }

  @Get()
  findAll() {
    return this.bookDoctorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookDoctorService.findOneById(id);
  }

  // @Patch(':id/cancel')
  // async cancelBooking(
  //   @Param('id', ParseIntPipe) bookingId: number,
  //   @Body('patientId', ParseIntPipe) patientId: number,
  // ) {
  //   return this.bookDoctorService.cancelBooking(bookingId, patientId);
  // }

  @Patch(':id/cancel')
  async cancelBooking(@Body() dto: CancelBookingDto) {
    return this.bookDoctorService.cancelBooking(dto);
  }

  @Patch(':id/reschedule')
  async rescheduleBooking(@Body() dto: RescheduleBookingDto) {
    return this.bookDoctorService.rescheduleBooking(dto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookDoctorService.delete(id);
  }
}
