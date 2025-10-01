import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { TokenService } from 'src/infrastructure/token/Token';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DoctorController],
  providers: [DoctorService, TokenService, JwtService],
})
export class DoctorModule {}
