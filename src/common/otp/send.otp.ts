import { UnauthorizedException } from '@nestjs/common';
import { OtpService } from 'src/common/otp/otp.service';
import { successRes } from 'src/infrastructure/response/success';

export class OTP {
  constructor(private readonly otpService: OtpService) {}

  async sendOtp(phone: string) {
    await this.otpService.generateOtp(phone);
    return successRes({ message: 'OTP sent' });
  }

  async verifyOtpAndLogin(phone: string, code: string, res: Response) {
    const isValid = await this.otpService.verifyOtp(phone, code);
    if (!isValid) throw new UnauthorizedException('OTP invalid');
  }
}
