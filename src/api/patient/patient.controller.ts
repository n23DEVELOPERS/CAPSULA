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
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { VerifyOtpDto } from 'src/common/dto/verify-otp.dto';
import { SignInUserDto } from 'src/common/dto/sign-in-user.dto';
import type { Response } from 'express';
import { ForgetPassDto } from 'src/common/dto/forgetPass.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CookieGetter } from 'src/common/decorator/cookie-getter.decorator';
import { AuthService } from '../auth/auth..service';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService,
    private readonly auth: AuthService,
  ) { }

  @Post('sendOtpRegister')
  requestOtp(@Body() dto: CreatePatientDto) {
    return this.patientService.requestOtp(dto);
  }

  @Post('verifyAndRegister')
  verifyOtp(@Body() body: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
    return this.patientService.verifyOtpRegister(body.phone_number, body.code, res);
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

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.PATIENT)
  @ApiBearerAuth()
  @Post('signout')
  signOut(
    @CookieGetter('authKey') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.signOut(token, res, 'authKey');
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Get()
  @ApiBearerAuth()
  findAll() {
    return this.patientService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: number) {
    return this.patientService.findOneById(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, 'ID')
  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: number, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.updatePatient(id, updatePatientDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, 'ID')
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: number) {
    return this.patientService.delete(id);
  }
}
