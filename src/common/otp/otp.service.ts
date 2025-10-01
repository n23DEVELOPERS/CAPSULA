import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class OtpService {
  constructor(@Inject('CACHE_MANAGER') private cache: Cache) {}

  async generateOtp(phone: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.cache.set(`otp:${phone}`, otp, 300);

    console.log(`OTP ${otp} sent to ${phone}`);

    return otp;
  }

  async verifyOtp(phone: string, code: string): Promise<boolean> {
    const storedOtp = await this.cache.get<string>(`otp:${phone}`);
    if (!storedOtp) throw new UnauthorizedException('OTP expired');

    if (storedOtp !== code) {
      throw new UnauthorizedException('OTP incorrect');
    }

    await this.cache.del(`otp:${phone}`);
    return true;
  }
}
