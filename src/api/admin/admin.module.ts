import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CryptoService } from 'src/infrastructure/crypt/Crypto';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth..service';
import { TokenService } from 'src/infrastructure/token/Token';

@Module({
  controllers: [AdminController],
  providers: [AdminService, CryptoService, TokenService, JwtService, AuthService],
})
export class AdminModule {}
