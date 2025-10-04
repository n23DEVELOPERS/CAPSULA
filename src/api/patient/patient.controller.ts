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
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ApiProperty } from '@nestjs/swagger';
import { VerifyOtpDto } from 'src/common/dto/verify-otp.dto';
import { SignInUserDto } from 'src/common/dto/sign-in-user.dto';
import type { Response } from 'express';
import { ForgetPassDto } from 'src/common/dto/forgetPass.dto';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post('sendOtpRegister')
  requestOtp(@Body() dto: CreatePatientDto) {
    return this.patientService.requestOtp(dto);
  }

  @Post('verifyAndRegister')
  verifyOtp(@Body() body: VerifyOtpDto) {
    return this.patientService.verifyOtpRegister(body.phone_number, body.code);
  }

  @Post('forgot-password/send-otp')
  sendOtp(@Body() body: ForgetPassDto) {
    return this.patientService.forgetPassword(body);
  }

  @Post('forgot-password/confirm-otp')
  confirmOtp(@Body() body: VerifyOtpDto) {
    return this.patientService.confirmOtp(body);
  }

  @Post('forgot-password/reset')
  resetPassword(@Body() body: SignInUserDto) {
    return this.patientService.resetPassword(body);
  }

  @Post('forgot-password/resend-otp')
  resendOtp(@Body() body: ForgetPassDto) {
    return this.patientService.forgetPassword(body);
  }

  @Post('signin')
  signin(
    @Body() signInDto: SignInUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.patientService.signIn(signInDto, res);
  }

  @ApiProperty()
  @Get()
  findAll() {
    return this.patientService.findAll();
  }

  @ApiProperty()
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.patientService.findOneById(id);
  }

  @ApiProperty()
  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.updatePatient(id, updatePatientDto);
  }

  @ApiProperty()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.patientService.delete(id);
  }
}
