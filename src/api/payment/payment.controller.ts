import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/enum';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CookieGetter } from 'src/common/decorator/cookie-getter.decorator';
import { TokenService } from 'src/infrastructure/token/Token';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly token: TokenService,
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN, Roles.PATIENT)
  @Post()
  @ApiBearerAuth()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN, Roles.PATIENT)
  @Get()
  @ApiBearerAuth()
  findAll() {
    return this.paymentService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN, Roles.PATIENT)
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: number) {
    return this.paymentService.findOneById(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN)
  @Patch(':id')
  @ApiBearerAuth()
  async update(
    @Param('id') id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @CookieGetter('authKey') token: string,
  ) {
    return this.paymentService.updatePayment(id, token, updatePaymentDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: number) {
    return this.paymentService.delete(id);
  }
}
