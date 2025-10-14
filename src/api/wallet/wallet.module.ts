import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { TokenService } from 'src/infrastructure/token/Token';

@Module({
  controllers: [WalletController],
  providers: [WalletService, TokenService],
})
export class WalletModule {}
