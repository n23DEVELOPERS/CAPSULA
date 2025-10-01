import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { JwtModule } from '@nestjs/jwt';
import { WalletModule } from './wallet/wallet.module';

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
    WalletModule
  ],
})
export class AppModule {}
