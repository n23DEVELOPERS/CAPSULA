import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth..service';
import { SignInUserDto } from 'src/api/dto/sign-in-user.dto';
import { SignInAdminDto } from 'src/api/dto/sign-in-admin.dto';
import type { Response, Request } from 'express';
import { SendOtpDto } from '../dto/send-otp.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in-user')
  async signInUser(
    @Body() dto: SignInUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signInUser(dto.phone_number, dto.password, res);
  }

  @Post('sign-in-admin')
  async signInAdmin(
    @Body() dto: SignInAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signInAdmin(dto.username, dto.password, res);
  }

  @Post('refresh')
  async newToken(@Req() req: Request) {
    const token = req.cookies?.authKey;
    if (!token) throw new UnauthorizedException('Refresh token missing');
    return this.authService.newToken(token);
  }

  @Post('sign-out')
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.authKey;
    if (!token) throw new UnauthorizedException('Refresh token missing');
    return this.authService.signOut(token, res, 'authKey');
  }
}
