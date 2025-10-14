import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Speciality } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { successRes } from 'src/infrastructure/response/success';

@Injectable()
export class SpecialityService extends BaseService<
  CreateSpecialityDto,
  UpdateSpecialityDto,
  Speciality
> {
  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.speciality, 'Speciality not found');
  }
  async createSpec(spaceDto: CreateSpecialityDto) {
    const specName = await this.prisma.speciality.findUnique({
      where: { name: spaceDto.name },
    });
    if (specName) throw new ConflictException('Speciality already exists');
    const data = await this.prisma.speciality.create({
      data: spaceDto,
    });
    return successRes(data, 201);
  }

  async updateSpec(id: number, spaceDto: UpdateSpecialityDto) {
    const speciality = await this.prisma.speciality.findUnique({
      where: { id },
    });
    if (!speciality) throw new NotFoundException('Speciality not found');
    if (spaceDto.name) {
      const specName = await this.prisma.speciality.findUnique({
        where: { name: spaceDto.name },
      });
      if (specName && specName.id !== id)
        throw new ConflictException('Speciality already exists');
    }
    const data = await this.prisma.speciality.update({
      where: { id },
      data: spaceDto,
    });
    return successRes(data);
  }
}
