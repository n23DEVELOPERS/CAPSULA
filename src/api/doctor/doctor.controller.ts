import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorWithDocumentDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { SignInOtpDto } from './dto/signin-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import type { Response } from 'express';
import { Roles } from 'src/common/enum';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { AccessRoles } from 'src/common/decorator/roles.decorator';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        // Doctor ma’lumotlari
        speciality: {
          type: 'integer',
          example: 1,
        },
        services: {
          type: 'integer',
          example: 2,
        },
        first_name: { type: 'string', example: 'Bek' },
        last_name: { type: 'string', example: 'Olimjon' },
        phone_number: { type: 'string', example: '+998900474600' },
        age: { type: 'integer', example: 25 },
        gender: { type: 'string', enum: ['MALE', 'FEMALE'], example: 'MALE' },
        location: { type: 'string', example: 'Tashkent, Uzbekistan' },
        is_active: { type: 'boolean', example: true },
        role: { type: 'string', enum: ['DOCTOR'], example: 'DOCTOR' },

        // Doctor_document ma’lumotlari
        passport_url: { type: 'string', format: 'binary' },
        diplom_url: { type: 'string', format: 'binary' },
        certificate_url: { type: 'string', format: 'binary' },
        self_employment_url: { type: 'string', format: 'binary' },
        image_url: { type: 'string', format: 'binary' },
      },
      required: [
        'speciality',
        'first_name',
        'last_name',
        'phone_number',
        'age',
        'gender',
        'location',
        'passport_url',
      ],
    },
  })
  @Post()
  create(@Body() createDoctorDto: CreateDoctorWithDocumentDto) {
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

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Get()
  findAll() {
    return this.doctorService.findAll({ where: { is_active: true } });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, 'ID')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.doctorService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, 'ID')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorService.update(id, updateDoctorDto);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, 'ID')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.doctorService.delete(id);
  }
}
