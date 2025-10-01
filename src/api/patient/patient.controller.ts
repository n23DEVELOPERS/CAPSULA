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

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @ApiProperty()
  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.createPatient(createPatientDto);
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
