import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DoctorBookTimeService } from './doctor-book-time.service';
import { CreateDoctorBookTimeDto } from './dto/create-doctor-book-time.dto';
import { UpdateDoctorBookTimeDto } from './dto/update-doctor-book-time.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from '@prisma/client';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { CookieGetter } from 'src/common/decorator/cookie-getter.decorator';

@Controller('doctor-book-time')
export class DoctorBookTimeController {
  constructor(
    private readonly doctorBookTimeService: DoctorBookTimeService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.DOCTOR)
  @Post()
  @Post('create-book-time')
  async createBookTime(@CookieGetter('authKey') token: string, @Body() dto: CreateDoctorBookTimeDto) {
    return this.doctorBookTimeService.createBookTime(token, dto);
  }

  @Get()
  findAll() {
    return this.doctorBookTimeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorBookTimeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDoctorBookTimeDto: UpdateDoctorBookTimeDto,
  ) {
    return this.doctorBookTimeService.update(+id, updateDoctorBookTimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorBookTimeService.delete(+id);
  }
}
