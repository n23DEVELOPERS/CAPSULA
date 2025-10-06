import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { DoctorModule } from './doctor/doctor.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { CleanupService } from './admin/cron/clear.doctor.service';
import { DoctorBookTimeModule } from './doctor-book-time/doctor-book-time.module';

@Module({
  imports: [
    PrismaModule,
    AdminModule,
    DoctorModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 5 * 1000 * 60,
    }),

    ServeStaticModule.forRoot({
      rootPath: '/root/uploads',
      serveRoot: '/api/v1/uploads',
    }),

    ScheduleModule.forRoot(),

    DoctorBookTimeModule,
  ],

  providers: [CleanupService],
})
export class AppModule {}
