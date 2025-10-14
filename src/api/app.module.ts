import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { JwtModule } from '@nestjs/jwt';
import { WalletModule } from './wallet/wallet.module';
import { RedisModule } from 'src/core/redis.module';
import { ServiceModule } from './service/service.module';
import { PaymentModule } from './payment/payment.module';
import { SpecialityModule } from './speciality/speciality.module';
import { BookDokctorModule } from './book_dokctor/book_dokctor.module';
import { ChatModule } from './chat/chat.module';
import { AiChatModule } from './ai-chat/ai-chat.module';
import { AdminModule } from './admin/admin.module';
import { DoctorModule } from './doctor/doctor.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { DoctorBookTimeModule } from './doctor-book-time/doctor-book-time.module';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    ConfigModule.forRoot({ isGlobal: true }),

    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: redisStore as any,
        socket: {
          host: config.get('REDIS_HOST') || 'localhost',
          port: config.get('REDIS_PORT') || 6379,
        },
        ttl: 0,
      }),
    }),

    ServeStaticModule.forRoot({
      rootPath: '/root/uploads',
      serveRoot: '/api/v1/uploads',
    }),

    ScheduleModule.forRoot(),

    PrismaModule,
    AuthModule,
    PatientModule,
    WalletModule,
    RedisModule,
    ServiceModule,
    PaymentModule,
    SpecialityModule,
    BookDokctorModule,
    ChatModule,
    AiChatModule,
    AdminModule,
    DoctorModule,
    DoctorBookTimeModule,
  ],
  providers: [],
})
export class AppModule {}
