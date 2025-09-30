import { ConflictException, Injectable, OnModuleInit } from '@nestjs/common';
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
    const existsAdmin = await this.model.findFirst({
      where: { role: Roles.SUPERADMIN },
    });

    if (!existsAdmin) {
      const hashPassword = await this.crypto.encrypt(config.ADMIN_PASSWORD);

      await this.model.create({
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

    const existsUsername = await this.model.findUnique({ where: { username } });
    if (existsUsername)
      throw new ConflictException(`uz: Username allaqachon mavjud.
    en: Username already exists.
    ru: Имя пользователя уже существует.`);

    const existsPhoneNumber = await this.model.findUnique({
      where: { phone_number },
    });
    if (existsPhoneNumber)
      throw new ConflictException(`
    uz: Telefon raqami allaqachon mavjud.
    en: Phone number already exists.
    ru: Номер телефона уже существует.`);

    const hashedPassword = await this.crypto.encrypt(createAdminDto.password);

    const newAdmin = await this.model.create({
      data: {
        username: createAdminDto.username,
        phone_number: createAdminDto.phone_number,
        hashed_password: hashedPassword,
        role: createAdminDto.role,
        is_active: createAdminDto.is_active ?? true,
      },
    });

    return successRes(newAdmin, 201);
  }

  updateAdmin(id: number, updateAdminDto: UpdateAdminDto) {}
}
