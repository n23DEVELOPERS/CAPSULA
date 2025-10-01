import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Patient } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CryptoService } from 'src/infrastructure/crypt/Crypto';
import { TokenService } from 'src/infrastructure/token/Token';
import { successRes } from 'src/infrastructure/response/success';

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
  ) {
    super(prisma, prisma.patient, 'Patient not found');
  }
  async registerPatient(createPatientDto: CreatePatientDto) {
    const { password, ...rest } = createPatientDto;
    const existsPhone = await this.prisma.patient.findUnique({
      where: { phone_number: createPatientDto.phone_number },
    });
    if (existsPhone) {
      throw new ConflictException('Phone number already exists');
    }
    const hashedPassword = await this.crypto.encrypt(createPatientDto.password);
    const newPatient = await this.prisma.patient.create({
      data: {
        ...rest,
        hashed_password: hashedPassword,
      },
    });
    return successRes(newPatient, 201);
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
