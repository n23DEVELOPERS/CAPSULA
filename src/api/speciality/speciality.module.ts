import { Module } from '@nestjs/common';
import { SpecialityService } from './speciality.service';
import { SpecialityController } from './speciality.controller';
import { TokenService } from 'src/infrastructure/token/Token';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SpecialityController],
  providers: [SpecialityService, TokenService, JwtService],
})
export class SpecialityModule {}
