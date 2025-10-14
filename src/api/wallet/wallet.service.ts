import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { IToken } from 'src/infrastructure/token/interface';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Wallet } from '@prisma/client';
import { Roles, Wallet_type } from 'src/common/enum';
import { config } from 'src/config';
import { TokenService } from 'src/infrastructure/token/Token';
import { successRes } from 'src/infrastructure/response/success';
import { DebutWalletDto } from './dto/debut-wallet.Dto';

@Injectable()
export class WalletService extends BaseService<
  CreateWalletDto,
  UpdateWalletDto,
  Wallet
> {
  constructor(
    prisma: PrismaService,
    private readonly token: TokenService,
  ) {
    super(prisma, prisma.wallet, 'Wallet not found');
  }
  async createWallet(createWalletDto: CreateWalletDto, userToken: IToken) {
    const { type, cvv, card_number } = createWalletDto;
    const cardExists = await this.prisma.wallet.findUnique({
      where: { card_number },
    });
    if (cardExists) {
      throw new ConflictException('Card number aldready exists');
    }
    if ((type === Wallet_type.HUMO || type === Wallet_type.UZCARD) && cvv) {
      throw new BadRequestException(
        'UZCARD yoki HUMO kartalari uchun CVV kiritilmaydi',
      );
    } else if (
      (type === Wallet_type.MASTERCARD || type === Wallet_type.VISA) &&
      !cvv
    ) {
      throw new BadRequestException(
        'VISA yoki MASTERCARD uchun CVV kiritish majburiy',
      );
    }
    if (userToken.role === Roles.DOCTOR) {
      const data: any = {
        ...createWalletDto,
        doctor_id: userToken?.id,
        cvv: createWalletDto.cvv ? Number(createWalletDto.cvv) : 0,
      };
      return this.prisma.wallet.create({ data });
    } else if (userToken.role === Roles.PATIENT) {
      const data: any = {
        ...createWalletDto,
        patient_id: userToken?.id,
        cvv: createWalletDto.cvv ? Number(createWalletDto.cvv) : 0,
      };
      return this.prisma.wallet.create({ data });
    } else {
      throw new BadRequestException('You cannot create a wallet');
    }
  }

  async getWallByUser(token: string) {
    const decoded = (await this.token.verifyToken(
      token,
      config.TOKEN.REFRESH_KEY,
    )) as any;
    if (decoded.role === Roles.PATIENT) {
      const wall = await this.prisma.wallet.findMany({
        where: { patient_id: decoded.id },
      });
      if (wall.length === 0) throw new NotFoundException('Wallet not found');
      return successRes(wall);
    }
    if (decoded.role === Roles.DOCTOR) {
      const wall = await this.prisma.wallet.findMany({
        where: { doctor_id: decoded.id },
      });
      if (wall.length === 0) throw new NotFoundException('Wallet not found');
      return successRes(wall);
    } else {
      throw new BadRequestException('You cannot see a wallet');
    }
  }

  async updateWallet(
    id: number,
    updateWalletDto: UpdateWalletDto,
    userToken: IToken,
  ) {
    const walet = await this.prisma.wallet.findUnique({ where: { id } });
    if (!walet) throw new NotFoundException('Wallet not found');
    const { type, cvv } = updateWalletDto;
    if (type) {
      if ((type === Wallet_type.HUMO || type === Wallet_type.UZCARD) && cvv) {
        throw new BadRequestException(
          'UZCARD yoki HUMO kartalari uchun CVV kiritilmaydi',
        );
      } else if (
        (type === Wallet_type.MASTERCARD || type === Wallet_type.VISA) &&
        !cvv
      ) {
        throw new BadRequestException(
          'VISA yoki MASTERCARD uchun CVV kiritish majburiy',
        );
      }
    }
    const data: any = {
      ...updateWalletDto,
      user_id: userToken?.id,
      cvv: updateWalletDto.cvv ? Number(updateWalletDto.cvv) : 0,
    };

    return this.prisma.wallet.update({
      where: { id },
      data,
    });
  }

  async debutWallet(debutWalletDto: DebutWalletDto, user: IToken) {
    const cardNumber = await this.prisma.wallet.findUnique({
      where: { id: debutWalletDto.id },
    });
    if (!cardNumber) {
      throw new NotFoundException('Wollet number not found');
    }
    const newBal = cardNumber.balence + debutWalletDto.debutBalans;
    const data = await this.prisma.wallet.update({
      where: { id: debutWalletDto.id },
      data: { balence: newBal },
    });

    return successRes({ message: `balans ${data.balence}` });
  }
}
