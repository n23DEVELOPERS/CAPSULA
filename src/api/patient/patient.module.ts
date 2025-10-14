import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { TokenService } from 'src/infrastructure/token/Token';
import { CryptoService } from 'src/infrastructure/crypt/Crypto';
import { OTPService } from 'src/core/redis.service';

@Module({
  controllers: [PatientController],
  providers: [
    PatientService,
    // PrismaService,
    TokenService,
    CryptoService,
    OTPService,
  ],
})
export class PatientModule {}
