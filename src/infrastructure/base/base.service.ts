import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ISuccess } from '../response/success.interface';
import { successRes } from '../response/success';

@Injectable()
export class BaseService<CreateDto, UpdateDto, Entity> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly model: any,
    protected readonly notFoundMessage: string = 'Entity not found',
  ) {}

  async create(dto: CreateDto): Promise<ISuccess> {
    const data = await this.model.create({ data: dto });
    return successRes(data, 201);
  }

  async findAll(options?: {
    where?: any;
    select?: any;
    include?: any;
    orderBy?: any;
  }): Promise<ISuccess> {
    const data = await this.model.findMany({ ...options });
    return successRes(data);
  }

  async findAllWithPagination(options?: {
    where?: any;
    select?: any;
    include?: any;
    orderBy?: any;
    page?: number;
    limit?: number;
  }): Promise<ISuccess> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.model.findMany({
        where: options?.where,
        select: options?.select,
        include: options?.include,
        orderBy: options?.orderBy,
        skip,
        take: limit,
      }),
      this.model.count({ where: options?.where }),
    ]);

    const response = {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return successRes(response);
  }

  async findOneById(
    id: number,
    options?: { select?: any; include?: any },
  ): Promise<ISuccess> {
    const data = await this.model.findUnique({
      where: { id },
      ...options,
    });
    if (!data) {
      throw new NotFoundException(this.notFoundMessage);
    }
    return successRes(data);
  }

  async findOne(
    where: any,
    options?: { select?: any; include?: any },
  ): Promise<ISuccess> {
    const data = await this.model.findFirst({ where, ...options });
    if (!data) {
      throw new NotFoundException(this.notFoundMessage);
    }
    return successRes(data);
  }

  async update(id: number, dto: UpdateDto): Promise<ISuccess> {
    await this.findOneById(id);
    const data = await this.model.update({
      where: { id },
      data: dto,
    });
    return successRes(data);
  }

  async delete(id: number): Promise<ISuccess> {
    await this.findOneById(id);
    await this.model.delete({ where: { id } });
    return successRes({});
  }
}
