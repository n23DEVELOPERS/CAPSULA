import { Injectable } from '@nestjs/common';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Speciality } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class SpecialityService extends BaseService<
  CreateSpecialityDto,
  UpdateSpecialityDto,
  Speciality
> {
  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.speciality, 'Speciality not found');
  }
}
