import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Service } from '@prisma/client';
import { successRes } from 'src/infrastructure/response/success';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class ServiceService extends BaseService<
  CreateServiceDto,
  UpdateServiceDto,
  Service
> {
  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.service, 'servise not fount');
  }

  async checkExists(model: any, id: number, name: string): Promise<void> {
    const record = await model.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException(`${name} not found`);
    }
  }

  async createService(createServiceDto: CreateServiceDto) {
    const newService = await this.prisma.service.create({
      data: { ...createServiceDto },
    });
    return successRes(newService, 201);
  }

  async findAllService() {
    const services = await this.prisma.service.findMany({
      include: {
        doctor: true,
        Book_doctor: true,
      },
    });
    return successRes(services);
  }

  async findOneService(id: number) {
    await this.checkExists(this.prisma.service, id, 'service');
    const services = await this.prisma.service.findUnique({
      where: { id },
      include: {
        doctor: true,
        Book_doctor: true,
      },
    });
    return successRes(services);
  }

  async updateService(id: number, updateServiceDto: UpdateServiceDto) {
    await this.checkExists(this.prisma.service, id, 'service');

    const updatedServise = await this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
    return successRes(updatedServise);
  }
}
