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
import { DoctorBookTimeService } from './doctor-book-time.service';
import { CreateDoctorBookTimeDto } from './dto/create-doctor-book-time.dto';
import { UpdateDoctorBookTimeDto } from './dto/update-doctor-book-time.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from "src/common/enum/index";
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { CookieGetter } from 'src/common/decorator/cookie-getter.decorator';

@Controller('doctor-book-time')
export class DoctorBookTimeController {
  constructor(private readonly doctorBookTimeService: DoctorBookTimeService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.DOCTOR, Roles.ADMIN, Roles.SUPERADMIN)
  @Post()
  @Post('create-book-time')
  async createBookTime(
    @CookieGetter('doctorToken') token: string,
    @Body() dto: CreateDoctorBookTimeDto,
  ) {
    return this.doctorBookTimeService.createBookTime(token, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.DOCTOR, Roles.ADMIN, Roles.SUPERADMIN, Roles.PATIENT, 'ID')
  @Get()
  findAll() {
    return this.doctorBookTimeService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.DOCTOR, Roles.ADMIN, Roles.SUPERADMIN, Roles.PATIENT, 'ID')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.doctorBookTimeService.findOneById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.DOCTOR, Roles.ADMIN, Roles.SUPERADMIN, 'ID')
  @Patch(':id')
  update(
    @Param('id') id: number,
    @CookieGetter('doctorToken') token: string,
    @Body() updateDoctorBookTimeDto: UpdateDoctorBookTimeDto,
  ) {
    return this.doctorBookTimeService.updateBookTime(
      token,
      id,
      updateDoctorBookTimeDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.DOCTOR, Roles.ADMIN, Roles.SUPERADMIN, 'ID')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorBookTimeService.delete(+id);
  }
}
