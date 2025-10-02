import { Module } from '@nestjs/common';
import { AuthService } from 'src/api/auth/auth..service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { TokenService } from 'src/infrastructure/token/Token';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, TokenService],
  exports: [AuthService],
})
export class AuthModule {}
