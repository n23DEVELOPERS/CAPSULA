import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { DoctorModule } from './doctor/doctor.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    PrismaModule,
    AdminModule,
    DoctorModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 5 * 1000 * 60,
    }),
  ],
})
export class AppModule {}
