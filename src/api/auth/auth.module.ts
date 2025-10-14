import { Module } from '@nestjs/common';
import { AuthService } from 'src/api/auth/auth..service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { TokenService } from 'src/infrastructure/token/Token';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, TokenService],
  exports: [AuthService],
})
export class AuthModule {}
