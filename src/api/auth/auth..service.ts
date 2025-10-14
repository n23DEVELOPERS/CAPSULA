import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { TokenService } from 'src/infrastructure/token/Token';
import { config } from 'src/config';
import { successRes } from 'src/infrastructure/response/success';

interface IToken {
  id: number;
  role: string;
  isActive: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: TokenService,
  ) {}

  async signInUser(phone: string, password: string, res: Response) {
    let user: any = null;
    let role: string = '';

    user = await this.prisma.doctor.findUnique({
      where: { phone_number: phone },
    });
    if (user) role = 'DOCTOR';

    if (!user) {
      user = await this.prisma.patient.findUnique({
        where: { phone_number: phone },
      });
      if (user) role = 'PATIENT';
    }

    if (!user)
      throw new UnauthorizedException('phone number or password incorrect');

    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch)
      throw new UnauthorizedException('phone number or password incorrect');

    const payload: IToken = { id: user.id, isActive: user.isActive, role };
    const accessToken = await this.jwt.accessToken(payload);
    const refreshToken = await this.jwt.refreshToken(payload);

    await this.jwt.writeCookie(res, 'authKey', refreshToken, 30);

    return successRes({ accessToken, role });
  }

  async signInAdmin(username: string, password: string, res: Response) {
    const user = await this.prisma.admin.findUnique({
      where: { username },
    });

    if (!user)
      throw new UnauthorizedException('username or password incorrect');

    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch)
      throw new UnauthorizedException('username or password incorrect');

    const payload: IToken = {
      id: user.id,
      isActive: user.is_active,
      role: user.role,
    };
    const accessToken = await this.jwt.accessToken(payload);
    const refreshToken = await this.jwt.refreshToken(payload);

    await this.jwt.writeCookie(res, 'authKey', refreshToken, 30);

    return successRes({ accessToken, role: user.role });
  }

  async newToken(token: string) {
    const data: any = await this.jwt.verifyToken(
      token,
      config.TOKEN.REFRESH_KEY,
    );
    if (!data) throw new UnauthorizedException('Refresh token expired');

    let user: any = null;
    switch (data.role) {
      case 'DOCTOR':
        user = await this.prisma.doctor.findUnique({ where: { id: data.id } });
        break;
      case 'PATIENT':
        user = await this.prisma.patient.findUnique({ where: { id: data.id } });
        break;
      case 'ADMIN':
      case 'SUPERADMIN':
        user = await this.prisma.admin.findUnique({ where: { id: data.id } });
        break;
    }

    if (!user) throw new ForbiddenException('Forbidden user');

    const payload: IToken = {
      id: user.id,
      isActive: data.isActive,
      role: data.role,
    };
    const accessToken = await this.jwt.accessToken(payload);
    const refreshToken = await this.jwt.refreshToken(payload);

    return successRes({ token: accessToken });
  }

  async signOut(token: string, res: Response, tokenKey: string) {
    const data: any = await this.jwt.verifyToken(
      token,
      config.TOKEN.REFRESH_KEY,
    );
    if (!data) throw new UnauthorizedException('Refresh token expired');

    let user: any = null;
    switch (data.role) {
      case 'DOCTOR':
        user = await this.prisma.doctor.findUnique({ where: { id: data.id } });
        break;
      case 'PATIENT':
        user = await this.prisma.patient.findUnique({ where: { id: data.id } });
        break;
      case 'ADMIN':
      case 'SUPERADMIN':
        user = await this.prisma.admin.findUnique({ where: { id: data.id } });
        break;
    }

    if (!user) throw new ForbiddenException('Forbidden user');

    res.clearCookie(tokenKey);
    return successRes({ message: 'Successfully logged out' });
  }
}
