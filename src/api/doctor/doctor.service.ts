import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDoctorWithDocumentDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Doctor, Roles } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { successRes } from 'src/infrastructure/response/success';
import { SignInOtpDto } from './dto/signin-otp.dto';
import { TokenService } from 'src/infrastructure/token/Token';
import { IToken } from 'src/infrastructure/token/interface';
import { Response } from 'express';
import { FileService } from 'src/infrastructure/file/file.service';
import { SigninDtoDoctor } from './dto/signin.dto';
import { CryptoService } from 'src/infrastructure/crypt/Crypto';
import { ConfirmForgotPasswordDto } from './dto/confirm-password.dto';
import { VerifyOtpDto } from 'src/common/dto/verify-otp.dto';
import type { RedisClientType } from 'redis';
import { NotificationGateway } from '../admin/socket/notification.gateway';
import { BookDoctorStatus } from 'src/common/enum';
import { UpdateBookStatus } from './dto/update-status.dto';
import { config } from 'src/config';

@Injectable()
export class DoctorService extends BaseService<
  CreateDoctorWithDocumentDto,
  UpdateDoctorDto,
  Doctor
> {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly token: TokenService,
    private readonly fileService: FileService,
    @Inject('REDIS_CLIENT') private redis: RedisClientType,
    private readonly crypto: CryptoService,
    private readonly notificationGateway: NotificationGateway,
  ) {
    super(prisma, prisma.doctor, 'Doctor not found');
  }

  async sendOtp(dto: SignInOtpDto) {
    const { phone_number } = dto;

    const exists = await this.prisma.doctor.findUnique({
      where: { phone_number },
    });
    if (exists) throw new ConflictException('This phone number already exists');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.redis.setEx(
      `otp:${phone_number}`,
      300,
      JSON.stringify({ otp, verified: false }),
    );

    return successRes({ message: 'OTP sent', otp });
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { phone_number, code } = dto;

    const data = await this.redis.get(`otp:${phone_number}`);
    if (!data) throw new BadRequestException('OTP expired or not found');

    const parsed = JSON.parse(data);

    if (parsed.otp !== code) throw new BadRequestException('Invalid OTP');

    await this.redis.setEx(
      `otp:${phone_number}`,
      600,
      JSON.stringify({ verified: true }),
    );

    return successRes({
      message: 'OTP verified successfully',
      phone_number,
    });
  }

  async registerDoctor(
    dto: CreateDoctorWithDocumentDto,
    passport: Express.Multer.File[],
    diplom: Express.Multer.File[],
    certificate: Express.Multer.File[],
    selfEmployment: Express.Multer.File[],
    image: Express.Multer.File[],
  ) {
    const { phone_number } = dto;

    const otpData = await this.redis.get(`otp:${phone_number}`);
    if (!otpData) throw new ForbiddenException('OTP not verified or expired');

    const parsed = JSON.parse(otpData);
    if (!parsed.verified)
      throw new ForbiddenException('Phone not verified yet');

    return await this.prisma.$transaction(async (tx) => {
      const hashed = await this.crypto.encrypt(dto.password);

      const doctor = await tx.doctor.create({
        data: {
          first_name: dto.first_name,
          last_name: dto.last_name,
          phone_number,
          age: dto.age,
          gender: dto.gender,
          location: dto.location,
          hashed_password: hashed,
          role: Roles.DOCTOR,
        },
      });

      const doctorDocs = await tx.doctor_docs.create({
        data: {
          doctor_id: doctor.id,
          passport_url: passport?.[0]?.originalname ?? null,
          diplom_url: diplom?.[0]?.originalname ?? null,
          certificate_url: certificate?.[0]?.originalname ?? null,
          self_employment_url: selfEmployment?.[0]?.originalname ?? null,
          image_url: image?.[0]?.originalname ?? null,
        },
      });

      await this.redis.del(`otp:${phone_number}`);
      this.notificationGateway.sendNotificationToAdmins({
        title: 'Yangi shifokor ariza topshirdi',
        message: `${doctor.first_name} ${doctor.last_name} ariza yubordi.`,
        doctorId: doctor.id,
        time: new Date().toISOString(),
      });

      return successRes({
        doctor,
        doctorDocs,
      });
    });
  }

  async confirmForGetPassword(dto: ConfirmForgotPasswordDto) {
    const { phone_number, newPassword } = dto;
    const doctor = await this.prisma.doctor.findUnique({
      where: { phone_number },
    });

    if (!doctor) throw new NotFoundException('phone number not found');

    const hashedPassword = await this.crypto.encrypt(newPassword);
    await this.prisma.doctor.update({
      where: { id: doctor.id },
      data: { hashed_password: hashedPassword },
    });

    return { message: 'success' };
  }

  async forgetPassword(dto: SignInOtpDto) {
    const { phone_number } = dto;

    const exists = await this.prisma.doctor.findUnique({
      where: { phone_number },
    });
    if (!exists) throw new ConflictException('This phone number not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.redis.setEx(
      `otp:${phone_number}`,
      300,
      JSON.stringify({ otp, verified: false }),
    );

    return successRes({ message: 'OTP sent', otp });
  }

  async signin(signinDto: SigninDtoDoctor, res: Response) {
    const { phone_number, password } = signinDto;

    const doctor = await this.prisma.doctor.findUnique({
      where: { phone_number },
    });

    if (!doctor) {
      throw new BadRequestException(`
    uz: Telefon raqami yoki parol noto'g'ri.
    en: Phone number or password is incorrect.
    ru: Номер телефона или пароль неверны.
  `);
    }

    const isMatch = await this.crypto.decrypt(
      password,
      doctor.hashed_password || '',
    );

    if (!isMatch) {
      throw new BadRequestException(`
    uz: Telefon raqami yoki parol noto'g'ri.
    en: Phone number or password is incorrect.
    ru: Номер телефона или пароль неверны.
  `);
    }

    if (doctor.is_active === false) {
      throw new ForbiddenException(`
    uz: Sizning arizangiz hali tasdiqlanmagan.
    en: Your application has not been approved yet.
    ru: Ваша заявка ещё не подтверждена.
  `);
    }

    const payload: IToken = {
      id: doctor.id,
      role: doctor.role,
      isActive: true,
    };

    const accessToken = await this.token.accessToken(payload);
    const refreshToken = await this.token.refreshToken(payload);
    await this.token.writeCookie(res, 'authKey', refreshToken, 30);
    return successRes({
      accessToken,
      refreshToken,
    });
  }

  async updateDoctor(
    id: number,
    updateDoctorDto: UpdateDoctorDto,
    files?: {
      passport_url?: Express.Multer.File[];
      diplom_url?: Express.Multer.File[];
      certificate_url?: Express.Multer.File[];
      self_employment_url?: Express.Multer.File[];
      image_url?: Express.Multer.File[];
    },
  ) {
    return this.prisma.$transaction(async (manager) => {
      const doctor = await manager.doctor.findUnique({
        where: { id },
        include: { doctor_docs: true },
      });

      if (!doctor) throw new NotFoundException('Doctor not found');

      const doctorDoc = doctor.doctor_docs[0]; // faqat bitta hujjat ishlatyapsiz
      if (!doctorDoc) throw new NotFoundException('Doctor docs not found');

      let passportUrl = doctorDoc.passport_url;
      let diplomUrl = doctorDoc.diplom_url;
      let certificateUrl = doctorDoc.certificate_url;
      let selfEmploymentUrl = doctorDoc.self_employment_url;
      let imageUrl = doctorDoc.image_url;

      if (files?.passport_url?.[0]) {
        if (passportUrl) await this.fileService.delete(passportUrl);
        passportUrl = await this.fileService.create(files.passport_url[0]);
      }

      if (files?.diplom_url?.[0]) {
        if (diplomUrl) await this.fileService.delete(diplomUrl);
        diplomUrl = await this.fileService.create(files.diplom_url[0]);
      }

      if (files?.certificate_url?.[0]) {
        if (certificateUrl) await this.fileService.delete(certificateUrl);
        certificateUrl = await this.fileService.create(
          files.certificate_url[0],
        );
      }

      if (files?.self_employment_url?.[0]) {
        if (selfEmploymentUrl) await this.fileService.delete(selfEmploymentUrl);
        selfEmploymentUrl = await this.fileService.create(
          files.self_employment_url[0],
        );
      }

      if (files?.image_url?.[0]) {
        if (imageUrl) await this.fileService.delete(imageUrl);
        imageUrl = await this.fileService.create(files.image_url[0]);
      }

      const {
        speciality,
        passport_url,
        diplom_url,
        self_employment_url,
        certificate_url,
        image_url,
        ...restDto
      } = updateDoctorDto;

      const updatedDoctor = await manager.doctor.update({
        where: { id },
        data: {
          ...restDto,
          doctor_docs: {
            updateMany: {
              where: { id: doctor.doctor_docs[0].id },
              data: {
                passport_url: passportUrl,
                diplom_url: diplomUrl,
                certificate_url: certificateUrl,
                self_employment_url: selfEmploymentUrl,
                image_url: imageUrl,
              },
            },
          },
        },
        include: { doctor_docs: true },
      });

      return successRes(updatedDoctor);
    });
  }

  async updateStatus(dto: UpdateBookStatus, token: string) {
    const decoded: any = await this.token.verifyToken(
      token,
      config.TOKEN.REFRESH_KEY,
    );
    console.log(decoded, dto);
    if (decoded.role !== Roles.DOCTOR) {
      throw new BadRequestException("You don't have the option to perform this operation")
    }
    const bookD = await this.prisma.book_doctor.findUnique({
      where: { id: dto.book_id },
    });
    if (!bookD) throw new NotFoundException('Book doctor not found');
    await this.prisma.book_doctor.update({ where: { id: dto.book_id }, data: { status: dto.status } });
    return successRes({message: `update success ( ${dto.status} )`});
  }

  async deleteDoctor(id: number) {
    return this.prisma.$transaction(async (manager) => {
      const doctor = await manager.doctor.findUnique({
        where: { id },
        include: { doctor_docs: true },
      });

      if (!doctor) throw new NotFoundException('Doctor not found');

      for (const doc of doctor.doctor_docs) {
        if (doc.passport_url) await this.fileService.delete(doc.passport_url);
        if (doc.diplom_url) await this.fileService.delete(doc.diplom_url);
        if (doc.certificate_url)
          await this.fileService.delete(doc.certificate_url);
        if (doc.self_employment_url)
          await this.fileService.delete(doc.self_employment_url);
        if (doc.image_url) await this.fileService.delete(doc.image_url);

        await manager.doctor_docs.delete({
          where: { id: doc.id },
        });
      }

      await manager.doctor.delete({ where: { id } });

      return successRes({ message: 'Doctor deleted successfully' });
    });
  }
}
