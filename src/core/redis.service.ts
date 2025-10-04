import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { RedisClientType } from 'redis';

@Injectable()
export class OTPService {
  constructor(@Inject('REDIS_CLIENT') private redis: RedisClientType) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(key: string, min: number, value: object) {
    const otp = this.generateOtp();
    await this.redis.setEx(key, min * 60, JSON.stringify({ value, otp }));
    return otp;
  }

  async verifyOtp(key: string) {
    return this.redis.get(key);
  }
}
