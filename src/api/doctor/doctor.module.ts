import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { TokenService } from 'src/infrastructure/token/Token';
import { JwtService } from '@nestjs/jwt';
import { FileService } from 'src/infrastructure/file/file.service';
import { CryptoService } from 'src/infrastructure/crypt/Crypto';
import { AuthService } from '../auth/auth..service';

@Module({
  controllers: [DoctorController],
  providers: [
    DoctorService,
    TokenService,
    JwtService,
    FileService,
    CryptoService,
    AuthService,
  ],
})
export class DoctorModule {}
