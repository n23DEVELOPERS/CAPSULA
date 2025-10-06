import { Module } from '@nestjs/common';
import { DoctorBookTimeService } from './doctor-book-time.service';
import { DoctorBookTimeController } from './doctor-book-time.controller';
import { TokenService } from 'src/infrastructure/token/Token';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DoctorBookTimeController],
  providers: [DoctorBookTimeService, TokenService, JwtService],
})
export class DoctorBookTimeModule {}
