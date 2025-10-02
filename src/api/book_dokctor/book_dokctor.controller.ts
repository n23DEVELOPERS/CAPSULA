import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UpdateBookDokctorDto } from './dto/update-book_dokctor.dto';
import { BookDokctorServic } from './book_dokctor.service';
import { CreateBookDoctorDto } from './dto/create-book_dokctor.dto';

@Controller('book-dokctor')
export class BookDokctorController {
  constructor(private readonly bookDokctorService: BookDokctorServic) {}

  @Post()
  create(@Body() createBookDokctorDto: CreateBookDoctorDto) {
    return this.bookDokctorService.createBook(createBookDokctorDto);
  }

  @Get()
  findAll() {
    return this.bookDokctorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.bookDokctorService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateBookDokctorDto: UpdateBookDokctorDto,
  ) {
    return this.bookDokctorService.updateBook(id, updateBookDokctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.bookDokctorService.delete(id);
  }
}
