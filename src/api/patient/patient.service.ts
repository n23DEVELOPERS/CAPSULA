import {
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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redis.setEx(
      `otp:${createPatientDto.phone_number}`,
      300,
      JSON.stringify({ ...createPatientDto, otp }),
    );
    return successRes({
      message: `OTP sent to ${createPatientDto.phone_number}: ${otp}`,
    });
  }
  async verifyOtp(phone_number: string, otp: string) {
    const dataStr = await this.redis.get(`otp:${phone_number}`);
    if (!dataStr) {
      throw new UnauthorizedException('OTP expired or not requested');
    }
    const data = JSON.parse(dataStr);
    if (data.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }
    const hashedPassword = await this.crypto.encrypt(data.password);
    const patient = await this.prisma.patient.create({
      data: {
        ...data,
        hashed_password: hashedPassword,
      },
    });
    await this.redis.del(`otp:${phone_number}`);
    return successRes({ message: 'Registration successful', patient }, 201);
  }

  async updatePatient(id: number, updatePatientDto: UpdatePatientDto) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found');
    const { password, ...rest } = updatePatientDto;
    let data: any = { ...rest };
    if (updatePatientDto.phone_number) {
      const existsPhone = await this.prisma.patient.findUnique({
        where: { phone_number: updatePatientDto.phone_number },
      });
      if (existsPhone) {
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
