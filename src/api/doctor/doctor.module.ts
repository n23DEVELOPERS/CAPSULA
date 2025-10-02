import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { TokenService } from 'src/infrastructure/token/Token';
import { JwtService } from '@nestjs/jwt';
import { FileService } from 'src/infrastructure/file/file.service';

@Module({
  controllers: [DoctorController],
  providers: [DoctorService, TokenService, JwtService, FileService],
})
export class DoctorModule {}
