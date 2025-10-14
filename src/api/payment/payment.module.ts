import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { TokenService } from 'src/infrastructure/token/Token';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  // imports: [PrismaModule],
  controllers: [PaymentController],
  providers: [PaymentService, TokenService],
})
export class PaymentModule {}
