import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDoctorDto } from './dto/create-book_dokctor.dto';
import { UpdateBookDokctorDto } from './dto/update-book_dokctor.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Book_doctor } from '@prisma/client';
import { successRes } from 'src/infrastructure/response/success';

@Injectable()
export class BookDokctorServic extends BaseService<
  CreateBookDoctorDto,
  UpdateBookDokctorDto,
  Book_doctor
> {
  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.book_doctor, 'book_doktor not fount');
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
