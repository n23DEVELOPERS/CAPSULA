import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { IToken } from 'src/infrastructure/token/interface';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Wallet } from '@prisma/client';

@Injectable()
export class WalletService extends BaseService<
  CreateWalletDto,
  UpdateWalletDto,
  Wallet
> {
  constructor(prisma: PrismaService) {
    super(prisma, prisma.wallet, 'Wallet not found');
  }
  async createWallet(createWalletDto: CreateWalletDto, userToken: IToken) {
    const ID = userToken?.id ?? 1;
    const data: any = {
      ...createWalletDto,
      user_id: ID,
      date: createWalletDto.date ? String(createWalletDto.date) : '00/00',
      cvv: createWalletDto.cvv ? Number(createWalletDto.cvv) : 0,
    };

    return this.prisma.wallet.create({ data });
  }

  async updateWallet(
    id: number,
    updateWalletDto: UpdateWalletDto,
    userToken: IToken,
  ) {
    const ID = userToken.id ?? 1;
    const data: any = {
      ...updateWalletDto,
      user_id: ID,
      date: updateWalletDto.date ? String(updateWalletDto.date) : '00/00',
      cvv: updateWalletDto.cvv ? Number(updateWalletDto.cvv) : 0,
    };

    return this.prisma.wallet.update({
      where: { id },
      data,
    });
  }
}
