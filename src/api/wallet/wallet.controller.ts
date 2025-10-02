import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { GetRequestUser } from 'src/common/decorator/get-request-user.decorator';
import type { IToken } from 'src/infrastructure/token/interface';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  create(
    @GetRequestUser('user') user: IToken,
    @Body() createWalletDto: CreateWalletDto,
  ) {
    return this.walletService.createWallet(createWalletDto, user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.walletService.findOneById(id);
  }

  @Patch(':id')
  update(
    @GetRequestUser('user') user: IToken,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    return this.walletService.updateWallet(id, updateWalletDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.walletService.delete(id);
  }
}
