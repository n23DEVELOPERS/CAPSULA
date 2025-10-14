import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Patient } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CryptoService } from 'src/infrastructure/crypt/Crypto';
import { TokenService } from 'src/infrastructure/token/Token';
import { successRes } from 'src/infrastructure/response/success';
import type { RedisClientType } from 'redis';
import { SignInUserDto } from 'src/common/dto/sign-in-user.dto';
import { IToken } from 'src/infrastructure/token/interface';
import { Response } from 'express';
import { OTPService } from 'src/core/redis.service';
import { ForgetPassDto } from 'src/common/dto/forgetPass.dto';
import { VerifyOtpDto } from 'src/common/dto/verify-otp.dto';

@Injectable()
export class PatientService extends BaseService<
  CreatePatientDto,
  UpdatePatientDto,
  Patient
> {
  constructor(
    prisma: PrismaService,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
    @Inject('REDIS_CLIENT') private redis: RedisClientType,
    private readonly otpService: OTPService,
  ) {
    super(prisma, prisma.patient, 'Patient not found');
  }
  async requestOtp(createPatientDto: CreatePatientDto) {
    const exists = await this.prisma.patient.findUnique({
      where: { phone_number: createPatientDto.phone_number },
    });
    if (exists) {
      throw new ConflictException('Phone number already registered');
    }
    const otp = await this.otpService.sendOtp(
      `register:${createPatientDto.phone_number}`,
      5,
      { ...createPatientDto },
    );
    console.log(otp);

    return successRes({
      message: `OTP sent to ${createPatientDto.phone_number}: ${otp}`,
    });
  }
  async verifyOtpRegister(phone_number: string, otp: string, res: Response) {
    const dataStr: any = await this.otpService.verifyOtp(
      `register:${phone_number}`,
    );

    if (dataStr === null || !dataStr) {
      throw new UnauthorizedException('OTP expired or not requested');
    }
    const data = JSON.parse(dataStr);

    if (data.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }
    const hashedPassword = await this.crypto.encrypt(data.value.password);
    const patient = await this.prisma.patient.create({
      data: {
        first_name: data.value.first_name,
        last_name: data.value.last_name,
        phone_number: data.value.phone_number,
        age: data.value.age,
        gender: data.value.gender,
        location: data.value.location,
        hashed_password: hashedPassword,
      },
    });
    await this.redis.del(`register:${phone_number}`);
    const payload: IToken = {
      id: patient.id,
      isActive: patient.is_active,
      role: patient.role,
    };
    const accessToken = await this.tokenService.accessToken(payload);
    const refreshToken = await this.tokenService.refreshToken(payload);
    await this.tokenService.writeCookie(res, 'authKey', refreshToken, 15);
    return successRes({ token: accessToken });
  }

  async forgetPassword(dto: ForgetPassDto) {
    const { phone_number } = dto;
    const patient = await this.prisma.patient.findUnique({
      where: { phone_number },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    const otp = this.otpService.sendOtp(`forgetPass:${phone_number}`, 5, {});
    return successRes({
      message: `OTP sent to ${phone_number}: ${otp}`,
    });
  }

  async confirmOtp(dto: VerifyOtpDto) {
    const { phone_number, code } = dto;
    const patient = await this.prisma.patient.findUnique({
      where: { phone_number },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    const dataStr: any = this.otpService.verifyOtp(
      `forgetPass:${phone_number}`,
    );
    if (dataStr === null || !dataStr) {
      throw new UnauthorizedException('OTP expired or not requested');
    }
    const data = JSON.parse(dataStr);
    if (data.otp !== code) {
      throw new UnauthorizedException('Invalid OTP');
    }
    await this.redis.del(`forgetPass:${phone_number}`);
    return { message: 'OTP confirmed successfully' };
  }

  async resetPassword(dto: SignInUserDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { phone_number: dto.phone_number },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    const hashedPassword = await this.crypto.encrypt(dto.password);
    patient.hashed_password = hashedPassword;

    return { message: 'Password reset successfully' };
  }

  async signIn(signInDto: SignInUserDto, res: Response) {
    const { phone_number, password } = signInDto;
    const patient = await this.prisma.patient.findUnique({
      where: { phone_number },
    });
    const isMatchPassword = await this.crypto.decrypt(
      password,
      patient?.hashed_password || '',
    );
    if (!patient || !isMatchPassword) {
      throw new BadRequestException('Phone number or password incorrect');
    }
    const payload: IToken = {
      id: patient.id,
      isActive: patient.is_active,
      role: patient.role,
    };
    const accessToken = await this.tokenService.accessToken(payload);
    const refreshToken = await this.tokenService.refreshToken(payload);
    await this.tokenService.writeCookie(res, 'authKey', refreshToken, 15);
    return successRes({ token: accessToken });
  }

  async updatePatient(id: number, updatePatientDto: UpdatePatientDto) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found');
    const { password, ...rest } = updatePatientDto;
    let data: any = { ...rest };
    if (data.phone_number) {
      const existsPhone = await this.prisma.patient.findUnique({
        where: { phone_number: data.phone_number },
      });
      if (existsPhone && existsPhone.id != id) {
        throw new ConflictException('Phone number already exists');
      }
    }
    if (password) {
      const hashedPassword = await this.crypto.encrypt(password);
      data.hashed_password = hashedPassword;
    }
    const updatedPatient = await this.prisma.patient.update({
      where: { id },
      data,
    });
    return successRes(updatedPatient);
  }
}
