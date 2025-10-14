import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Admin } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CryptoService } from 'src/infrastructure/crypt/Crypto';
import { Roles } from 'src/common/enum';
import { config } from 'src/config';
import { successRes } from 'src/infrastructure/response/success';

@Injectable()
export class AdminService
  extends BaseService<CreateAdminDto, UpdateAdminDto, Admin>
  implements OnModuleInit
{
  constructor(
    prisma: PrismaService,
    private readonly crypto: CryptoService,
  ) {
    super(prisma, prisma.admin, 'Admin not found');
  }

  async onModuleInit() {
    const existsAdmin = await this.prisma.admin.findFirst({
      where: { role: Roles.SUPERADMIN },
    });

    if (!existsAdmin) {
      const hashPassword = await this.crypto.encrypt(config.ADMIN_PASSWORD);

      await this.prisma.admin.create({
        data: {
          username: config.ADMIN_USERNAME,
          hashed_password: hashPassword,
          role: Roles.SUPERADMIN,
          is_active: true,
          phone_number: config.ADMIN_PHONE_NUMBER,
        },
      });

      console.log('SUPER ADMIN CREATED SUCCESSFULLY');
    }
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const { username, phone_number } = createAdminDto;

    const existsUsername = await this.prisma.admin.findUnique({
      where: { username },
    });
    if (existsUsername)
      throw new ConflictException(`uz: Username allaqachon mavjud.
    en: Username already exists.
    ru: Имя пользователя уже существует.`);

    const existsPhoneNumber = await this.prisma.admin.findUnique({
      where: { phone_number },
    });
    if (existsPhoneNumber)
      throw new ConflictException(`
    uz: Telefon raqami allaqachon mavjud.
    en: Phone number already exists.
    ru: Номер телефона уже существует.`);

    const hashedPassword = await this.crypto.encrypt(createAdminDto.password);

    const newAdmin = await this.prisma.admin.create({
      data: {
        username: createAdminDto.username,
        phone_number: createAdminDto.phone_number,
        hashed_password: hashedPassword,
      },
    });

    return successRes(newAdmin, 201);
  }

  async updateAdmin(id: number, updateAdminDto: UpdateAdminDto) {
    const { username, phone_number } = updateAdminDto;
    if (username) {
      const existsUsername = await this.prisma.admin.findUnique({
        where: { username },
      });
      if (existsUsername && existsUsername.id !== id)
        throw new ConflictException(`uz: Username allaqachon mavjud.
    en: Username already exists.
    ru: Имя пользователя уже существует.`);
    }

    if (phone_number) {
      const existsPhoneNumber = await this.prisma.admin.findUnique({
        where: { phone_number },
      });

      if (existsPhoneNumber && existsPhoneNumber.id !== id)
        throw new ConflictException(`
    uz: Telefon raqami allaqachon mavjud.
    en: Phone number already exists.
    ru: Номер телефона уже существует.`);
    }
    console.log(updateAdminDto);
    if (updateAdminDto.password) {
      updateAdminDto.password = await this.crypto.encrypt(
        updateAdminDto.password,
      );
    }
    console.log(updateAdminDto);

    const admin = await this.prisma.admin.update({
      where: { id },
      data: updateAdminDto,
    });

    return successRes(admin);
  }

  async verifyApplication(
    id: number,
    isVerified: boolean,
    description: string,
  ) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor)
      throw new NotFoundException(`        uz: Doctor topilmadi.,
        en: Doctor not found.,
        ru: Доктор не найден.,
      `);

    const verified = Boolean(isVerified);

    if (!verified) {
      await this.prisma.doctor.delete({ where: { id } });

      return successRes({
        message: {
          uz: 'Ariza tasdiqlanmadi (o`chirildi).',
          en: 'Application not verified (deleted).',
          ru: 'Заявка не подтверждена (удалена).',
        },
        description,
      });
    }

    await this.prisma.doctor.update({
      where: { id },
      data: { is_active: true },
    });

    return successRes({
      message: {
        uz: 'Ariza tasdiqlandi',
        en: 'Application verified',
        ru: 'Заявка подтверждена',
      },
    });
  }
}
