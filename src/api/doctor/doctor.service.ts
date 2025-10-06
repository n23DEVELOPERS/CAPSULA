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
import { FileService } from 'src/infrastructure/file/file.service';
import { SigninDtoDoctor } from './dto/signin.dto';
import { CryptoService } from 'src/infrastructure/crypt/Crypto';

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
    private readonly fileService: FileService,
    private readonly crypto: CryptoService,
  ) {
    super(prisma, prisma.doctor, 'Doctor not found');
  }

  async register(
    createDoctorDto: CreateDoctorWithDocumentDto,
    passportFiles: Express.Multer.File[] = [],
    diplomFiles: Express.Multer.File[] = [],
    certificateFiles: Express.Multer.File[] = [],
    selfEmploymentFiles: Express.Multer.File[] = [],
    imageFiles: Express.Multer.File[] = [],
  ) {
    const existsPhoneNumber = await this.prisma.doctor.findUnique({
      where: { phone_number: createDoctorDto.phone_number },
    });
    if (existsPhoneNumber)
      throw new ConflictException('Phone Number already exists');

    const hashed_password = await this.crypto.encrypt(createDoctorDto.password);

    return this.prisma.$transaction(async (manager) => {
      const doctor = await manager.doctor.create({
        data: {
          first_name: createDoctorDto.first_name,
          last_name: createDoctorDto.last_name,
          age: createDoctorDto.age,
          gender: createDoctorDto.gender,
          phone_number: createDoctorDto.phone_number,
          location: createDoctorDto.location,
          hashed_password,
          // speciality: {
          //   connect: { id: createDoctorDto.speciality },
          // },
        },
      });

      const passportUrls = await Promise.all(
        passportFiles.map((f) => this.fileService.create(f)),
      );
      const diplomUrls = await Promise.all(
        diplomFiles.map((f) => this.fileService.create(f)),
      );
      const certificateUrls = await Promise.all(
        certificateFiles.map((f) => this.fileService.create(f)),
      );
      const selfEmploymentUrls = await Promise.all(
        selfEmploymentFiles.map((f) => this.fileService.create(f)),
      );
      const imageUrls = await Promise.all(
        imageFiles.map((f) => this.fileService.create(f)),
      );

      const doctorDocument = await manager.doctor_docs.create({
        data: {
          doctorId: doctor.id,
          passport_url: passportUrls[0] || null,
          diplom_url: diplomUrls[0] || null,
          certificate_url: certificateUrls[0] || null,
          self_employment_url: selfEmploymentUrls[0] || null,
          image_url: imageUrls[0] || null,
        },
      });

      if (imageUrls.length > 0) {
        await manager.image.createMany({
          data: imageUrls.map((url) => ({
            doctor_docs_id: doctorDocument.id,
            image_url: url,
            name: url.split('/').pop() || 'image',
          })),
        });
      }

      return successRes({
        doctor,
        doctorDocument,
        images: imageUrls,
      });
    });
  }

  async registerWithOtp(dto: SignInOtpDto) {
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
    };

    const accessToken = await this.token.accessToken(payload);
    const refreshToken = await this.token.refreshToken(payload);
    await this.token.writeCookie(res, 'doctorToken', refreshToken, 30);
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

      // Fayllar bo‘yicha update qilish
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

      const { speciality, ...restDto } = updateDoctorDto;

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

  async deleteDoctor(id: number) {
    return this.prisma.$transaction(async (manager) => {
      const doctor = await manager.doctor.findUnique({
        where: { id },
        include: { doctor_docs: true },
      });

      if (!doctor) throw new NotFoundException('Doctor not found');

      // Fayllarni diskdan o‘chirish
      for (const doc of doctor.doctor_docs) {
        if (doc.passport_url) await this.fileService.delete(doc.passport_url);
        if (doc.diplom_url) await this.fileService.delete(doc.diplom_url);
        if (doc.certificate_url)
          await this.fileService.delete(doc.certificate_url);
        if (doc.self_employment_url)
          await this.fileService.delete(doc.self_employment_url);
        if (doc.image_url) await this.fileService.delete(doc.image_url);

        // doctor_docsni DBdan o‘chirish
        await manager.doctor_docs.delete({
          where: { id: doc.id },
        });
      }

      // Doctorni o‘chirish
      await manager.doctor.delete({ where: { id } });

      return successRes({ message: 'Doctor deleted successfully' });
    });
  }
}
