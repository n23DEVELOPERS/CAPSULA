import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { TokenService } from 'src/infrastructure/token/Token';
import { CryptoService } from 'src/infrastructure/crypt/Crypto';
import { OTPService } from 'src/core/redis.service';
import { AuthService } from '../auth/auth..service';

@Module({
  controllers: [PatientController],
  providers: [
    PatientService,
    AuthService,
    TokenService,
    CryptoService,
    OTPService,
  ],
})
export class PatientModule {}
