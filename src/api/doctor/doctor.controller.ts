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
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorWithDocumentDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { SignInOtpDto } from './dto/signin-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import type { Response } from 'express';
import { Roles } from 'src/common/enum';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { SigninDtoDoctor } from './dto/signin.dto';
import { CookieGetter } from 'src/common/decorator/cookie-getter.decorator';
import { AuthService } from '../auth/auth..service';

@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly auth: AuthService,
  ) {}

  @ApiOperation({ summary: 'Register doctor' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        speciality: { type: 'integer', example: 1 },
        first_name: { type: 'string', example: 'Bek' },
        last_name: { type: 'string', example: 'Olimjon' },
        phone_number: { type: 'string', example: '+998900474600' },
        age: { type: 'integer', example: 25 },
        gender: { type: 'string', enum: ['MALE', 'FEMALE'], example: 'MALE' },
        location: { type: 'string', example: 'Tashkent, Uzbekistan' },
        password: { type: 'string', example: 'Password123!' },
        passport_url: { type: 'string', format: 'binary' },
        diplom_url: { type: 'string', format: 'binary' },
        certificate_url: { type: 'string', format: 'binary' },
        self_employment_url: { type: 'string', format: 'binary' },
        image_url: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'passport_url', maxCount: 3 },
        { name: 'diplom_url', maxCount: 3 },
        { name: 'certificate_url', maxCount: 3 },
        { name: 'self_employment_url', maxCount: 3 },
        { name: 'image_url', maxCount: 1 },
      ],
      { storage: memoryStorage() },
    ),
  )
  @Post('register')
  register(
    @Body() createDoctorDto: CreateDoctorWithDocumentDto,
    @UploadedFiles()
    files: {
      passport_url?: Express.Multer.File[];
      diplom_url?: Express.Multer.File[];
      certificate_url?: Express.Multer.File[];
      self_employment_url?: Express.Multer.File[];
      image_url?: Express.Multer.File[];
    },
  ) {
    return this.doctorService.register(
      createDoctorDto,
      files.passport_url ?? [],
      files.diplom_url ?? [],
      files.certificate_url ?? [],
      files.self_employment_url ?? [],
      files.image_url ?? [],
    );
  }

  @Post('register-otp')
  registerWithOtp(@Body() dto: SignInOtpDto) {
    return this.doctorService.registerWithOtp(dto);
  }

  @Post('verify-otp')
  verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.doctorService.verifyOtp(dto, res);
  }

  @Post('signin')
  signIn(
    @Body() signinDto: SigninDtoDoctor,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.doctorService.signin(signinDto, res);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.DOCTOR)
  @ApiBearerAuth()
  @Post('new-token')
  newToken(@CookieGetter('authKey') token: string) {
    return this.auth.newToken(token);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.DOCTOR)
  @ApiBearerAuth()
  @Post('signout')
  signOut(
    @CookieGetter('authKey') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.signOut(token, res, 'authKey');
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.PATIENT, Roles.DOCTOR)
  @Get()
  findAll() {
    return this.doctorService.findAll({
      where: { is_active: true, is_delete: false },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone_number: true,
        gender: true,
        location: true,
        age: true,
        role: true,
        is_active: true,
        is_delete: true,

        speciality: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },

        doctor_docs: {
          select: {
            passport_url: true,
            diplom_url: true,
            certificate_url: true,
            self_employment_url: true,
            image_url: true,
            Image: {
              select: { image_url: true, name: true },
            },
          },
        },

        doctor_book_time: {
          select: {
            id: true,
            date: true,
            start_time: true,
            end_time: true,
          },
        },

        service: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
          },
        },
      },
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.PATIENT, 'ID')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.doctorService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.DOCTOR, 'ID')
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'passport_url', maxCount: 3 },
      { name: 'diplom_url', maxCount: 3 },
      { name: 'certificate_url', maxCount: 3 },
      { name: 'self_employment_url', maxCount: 3 },
      { name: 'image_url', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        first_name: { type: 'string', example: 'Bek' },
        last_name: { type: 'string', example: 'Olimjon' },
        age: { type: 'integer', example: 26 },
        gender: { type: 'string', enum: ['MALE', 'FEMALE'], example: 'FEMALE' },
        location: { type: 'string', example: 'Samarkand, Uzbekistan' },
        passport_url: { type: 'string', format: 'binary' },
        diplom_url: { type: 'string', format: 'binary' },
        certificate_url: { type: 'string', format: 'binary' },
        self_employment_url: { type: 'string', format: 'binary' },
        image_url: { type: 'string', format: 'binary' },
      },
    },
  })
  update(
    @Param('id') id: number,
    @Body() updateDoctorDto: UpdateDoctorDto,
    @UploadedFiles()
    files: {
      passport_url?: Express.Multer.File[];
      diplom_url?: Express.Multer.File[];
      certificate_url?: Express.Multer.File[];
      self_employment_url?: Express.Multer.File[];
      image_url?: Express.Multer.File[];
    },
  ) {
    return this.doctorService.updateDoctor(id, updateDoctorDto, files);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, 'ID')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.doctorService.deleteDoctor(id);
  }
}
