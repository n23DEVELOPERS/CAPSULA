import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { SignInOtpDto } from './dto/signin-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import type { Response } from 'express';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     properties: {
  //       speaciality: { type: 'number' },
  //       first_name: { type: 'string' },
  //       last_name: { type: 'string' },
  //       phone_number: { type: 'string' },
  //       age: { type: 'number' },
  //       gender: { type: 'enum' },
  //       location: { type: 'string' },
  //     },
  //   },
  // })
  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorService.createDoctor(createDoctorDto);
  }

  @Post('signin')
  signIn(@Body() dto: SignInOtpDto) {
    return this.doctorService.signInWithOtp(dto);
  }

  @Post('verify-otp')
  verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.doctorService.verifyOtp(dto, res);
  }

  @Get()
  findAll() {
    return this.doctorService.findAll({ where: { is_active: true } });
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.doctorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.doctorService.delete(id);
  }
}
