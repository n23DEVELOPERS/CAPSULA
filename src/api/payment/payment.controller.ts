import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/enum';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.paymentService.findOneById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: number, @Body() updatePaymentDto: UpdatePaymentDto) {
  //   return this.paymentService.update(id, updatePaymentDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.paymentService.delete(id);
  }
}
