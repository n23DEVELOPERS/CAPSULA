import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDoctorDto } from './dto/create-book_dokctor.dto';
import { UpdateBookDokctorDto } from './dto/update-book_dokctor.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Book_doctor } from '@prisma/client';
import { successRes } from 'src/infrastructure/response/success';
import { Roles } from 'src/common/enum';
import { TokenService } from 'src/infrastructure/token/Token';
import { config } from 'src/config';

@Injectable()
export class BookDokctorServic extends BaseService<
  CreateBookDoctorDto,
  UpdateBookDokctorDto,
  Book_doctor
> {
  constructor(
    protected prisma: PrismaService,
    private readonly token: TokenService,
  ) {
    super(prisma, prisma.book_doctor, 'book_doctor not fount');
  }

  async checkExists(model: any, id: number, name: string): Promise<void> {
    const record = await model.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException(`${name} not found`);
    }
  }

  async createBook(createBookDoctorDto: CreateBookDoctorDto) {
    const { service_id, doctor_id, speciality_id, patient_id } =
      createBookDoctorDto;

    const location = createBookDoctorDto.location || '';

    await this.checkExists(this.prisma.service, service_id, 'service');
    await this.checkExists(this.prisma.doctor, doctor_id, 'doctor');
    await this.checkExists(this.prisma.speciality, speciality_id, 'speciality');
    await this.checkExists(this.prisma.patient, patient_id, 'patient');

    const newBookDoctor = await this.prisma.book_doctor.create({
      data: { ...createBookDoctorDto, location },
    });

    return successRes(newBookDoctor, 201);
  }

  async findAllBook(token: string) {
    const decoded = (await this.token.verifyToken(
      token,
      config.TOKEN.REFRESH_KEY,
    )) as any;
    console.log(decoded);
    if (decoded.role === Roles.PATIENT) {
      const wall = await this.prisma.book_doctor.findMany({
        where: { patient_id: decoded.id },
      });
      if (wall.length === 0)
        throw new NotFoundException('Book doctor not found');
      return successRes(wall);
    }
    if (decoded.role === Roles.DOCTOR) {
      const wall = await this.prisma.book_doctor.findMany({
        where: { doctor_id: decoded.id },
      });
      if (wall.length === 0)
        throw new NotFoundException('Book doctor not found');
      return successRes(wall);
    }
    if (decoded.role === Roles.ADMIN || decoded.role === Roles.SUPERADMIN) {
      const wall = await this.prisma.book_doctor.findMany();
      if (wall.length === 0)
        throw new NotFoundException('Book doctor not found');
      return successRes(wall);
    }
  }

  async findOneByIdBook(id: number, token: string) {
    const decoded = (await this.token.verifyToken(
      token,
      config.TOKEN.REFRESH_KEY,
    )) as any;
    if (decoded.role === Roles.PATIENT) {
      const wall = await this.prisma.book_doctor.findMany({
        where: { patient_id: decoded.id, id },
      });
      if (wall.length === 0)
        throw new NotFoundException('Book doctor not found');
      return successRes(wall);
    }
    if (decoded.role === Roles.DOCTOR) {
      const wall = await this.prisma.book_doctor.findMany({
        where: { doctor_id: decoded.id, id },
      });
      if (wall.length === 0)
        throw new NotFoundException('Book doctor not found');
      return successRes(wall);
    }
    if (decoded.role === Roles.ADMIN || decoded.role === Roles.SUPERADMIN) {
      const wall = await this.prisma.book_doctor.findMany({ where: { id } });
      if (wall.length === 0)
        throw new NotFoundException('Book doctor not found');
      return successRes(wall);
    }
  }

  async updateBook(id: number, updateBookDoctorDto: UpdateBookDokctorDto) {
    const { service_id, doctor_id, speciality_id, patient_id } =
      updateBookDoctorDto;

    if (service_id) {
      await this.checkExists(this.prisma.service, service_id, 'service');
    }
    if (doctor_id) {
      await this.checkExists(this.prisma.doctor, doctor_id, 'doctor');
    }
    if (speciality_id) {
      await this.checkExists(
        this.prisma.speciality,
        speciality_id,
        'speciality',
      );
    }
    if (patient_id) {
      await this.checkExists(this.prisma.patient, patient_id, 'patient');
    }

    const location = updateBookDoctorDto.location ?? '';
    const updatedBookDoctor = await this.prisma.book_doctor.update({
      where: { id },
      data: { ...updateBookDoctorDto, location },
    });
    return successRes(updatedBookDoctor);
  }
}
