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

    AuthModule,
    PatientModule,
    WalletModule,
    RedisModule,
    ServiceModule,
    PaymentModule,
    SpecialityModule,
    BookDokctorModule
  ],
})
export class AppModule {}
