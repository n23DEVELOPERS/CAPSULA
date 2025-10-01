import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateDoctorWithDocumentDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Doctor } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';
import { successRes } from 'src/infrastructure/response/success';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SignInOtpDto } from './dto/signin-otp.dto';
import { TokenService } from 'src/infrastructure/token/Token';
import { IToken } from 'src/infrastructure/token/interface';
import { Response } from 'express';

@Injectable()
export class DoctorService extends BaseService<
  CreateDoctorWithDocumentDto,
  UpdateDoctorDto,
  Doctor
> {
  constructor(
    protected readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly token: TokenService,
  ) {
    super(prisma, prisma.doctor, 'Doctor not found');
  }
  async createDoctor(createDoctorDto: CreateDoctorWithDocumentDto) {
    const doctor = await this.prisma.doctor.create({ data: createDoctorDto });
  }

  async signInWithOtp(dto: SignInOtpDto) {
    const { phone_number } = dto;
    const existsPhoneNumber = await this.prisma.doctor.findUnique({
      where: { phone_number },
    });

    if (!existsPhoneNumber)
      throw new ConflictException(`
      uz: Telefon raqami noto'g'ri.
      en: Phone number incorrect.
      ru: Неверный номер телефона.
`);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.cacheManager.set(phone_number, otp);

    return successRes({
      phone_number,
      otp,
    });
  }

  async verifyOtp(dto: VerifyOtpDto, res: Response) {
    const { phone_number } = dto;
    const value = await this.cacheManager.get(phone_number);
    if (!value)
      throw new BadRequestException(`
      uz: Telefon raqami noto'g'ri yoki kodni vaqti o'tib ketgan.
      en: Phone number incorrect or otp expired.
      ru: Неверный номер телефона или срок действия кода истёк.
`);

    if (value !== dto.otp)
      throw new BadRequestException(`
      uz: otp noto'g'ri yoki vaqti o'tib ketgan.
      en: OTP is incorrect or has expired.
      ru: Неверный OTP или срок его действия истёк.
`);

    await this.cacheManager.del(phone_number);

    const doctor = await this.prisma.doctor.findUnique({
      where: { phone_number },
    });

    const payload: IToken = {
      id: doctor?.id!,
      role: doctor?.role!,
    };

    const accessToken = await this.token.accessToken(payload);
    const refreshToken = await this.token.refreshToken(payload);
    await this.token.writeCookie(res, 'doctorToken', refreshToken, 30);

    return successRes({
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  }

  updateDoctor(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  deleteDoctor(id: number) {
    return `This action removes a #${id} doctor`;
  }
}
