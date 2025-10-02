import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { GetRequestUser } from 'src/common/decorator/get-request-user.decorator';
import type { IToken } from 'src/infrastructure/token/interface';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  create(
    @Body() createServiceDto: CreateServiceDto,
    @GetRequestUser('user') user: IToken,
  ) {
    return this.serviceService.createService(createServiceDto, user);
  }

  @Get()
  findAll() {
    return this.serviceService.findAllService();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.serviceService.findOneService(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.updateService(id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.serviceService.delete(id);
  }
}
