import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ApiProperty } from '@nestjs/swagger';
import { VerifyOtpDto } from '../dto/verify-otp.dto';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post('register')
  requestOtp(@Body() dto: CreatePatientDto) {
    return this.patientService.requestOtp(dto);
  }

  @Post('verify')
  verifyOtp(@Body() body: VerifyOtpDto) {
    return this.patientService.verifyOtp(body.phone_number, body.code);
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
