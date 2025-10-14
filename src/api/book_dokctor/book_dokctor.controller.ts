import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UpdateBookDokctorDto } from './dto/update-book_dokctor.dto';
import { BookDokctorServic } from './book_dokctor.service';
import { CreateBookDoctorDto } from './dto/create-book_dokctor.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum';
import { CookieGetter } from 'src/common/decorator/cookie-getter.decorator';

@Controller('book-dokctor')
export class BookDokctorController {
  constructor(private readonly bookDokctorService: BookDokctorServic) {}

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN, Roles.PATIENT)
  @Post()
  @ApiBearerAuth()
  create(@Body() createBookDokctorDto: CreateBookDoctorDto) {
    return this.bookDokctorService.createBook(createBookDokctorDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN, Roles.PATIENT, Roles.DOCTOR)
  @Get()
  @ApiBearerAuth()
  findAll(@CookieGetter('authKey') token: string) {
    return this.bookDokctorService.findAllBook(token);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN, Roles.PATIENT, Roles.DOCTOR)
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: number, @CookieGetter('authKey') token: string) {
    return this.bookDokctorService.findOneByIdBook(id, token);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN, Roles.PATIENT, Roles.DOCTOR)
  @Patch(':id')
  @ApiBearerAuth()
  update(
    @Param('id') id: number,
    @Body() updateBookDokctorDto: UpdateBookDokctorDto,
  ) {
    return this.bookDokctorService.updateBook(id, updateBookDokctorDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: number) {
    return this.bookDokctorService.delete(id);
  }
}
