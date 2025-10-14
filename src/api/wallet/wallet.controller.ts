import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { GetRequestUser } from 'src/common/decorator/get-request-user.decorator';
import type { IToken } from 'src/infrastructure/token/interface';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/enum';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CookieGetter } from 'src/common/decorator/cookie-getter.decorator';
import { DebutWalletDto } from './dto/debut-wallet.Dto';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.DOCTOR, Roles.PATIENT)
  @Post()
  @ApiBearerAuth()
  create(
    @GetRequestUser('user') user: IToken,
    @Body() createWalletDto: CreateWalletDto,
  ) {
    return this.walletService.createWallet(createWalletDto, user);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Get()
  @ApiBearerAuth()
  findAl() {
    return this.walletService.findAll();
  }

  

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.DOCTOR, Roles.PATIENT)
  @Get(':id')
  @ApiBearerAuth()
  findOne(@CookieGetter('authKey') token: string) {
    return this.walletService.getWallByUser(token);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.DOCTOR, Roles.PATIENT)
  @Patch()
  @ApiBearerAuth()
  updateWallet(
    @GetRequestUser('user') user: IToken,
    @Body() debutWalletDto: DebutWalletDto,
  ) {
    return this.walletService.debutWallet( debutWalletDto, user);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.DOCTOR, Roles.PATIENT)
  @Patch(':id')
  @ApiBearerAuth()
  update(
    @GetRequestUser('user') user: IToken,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    return this.walletService.updateWallet(id, updateWalletDto, user);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.DOCTOR, Roles.PATIENT)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.walletService.delete(id);
  }
}
