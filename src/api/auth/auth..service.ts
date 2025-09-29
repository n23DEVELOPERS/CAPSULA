import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { config } from 'src/config';
import { successRes } from 'src/infrastructure/response/success';
import { IToken } from 'src/infrastructure/token/interface';
import { TokenService } from 'src/infrastructure/token/Token';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: TokenService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Role bo‘yicha userni qidirish
   */
  private async findUserByRole(id: number, role: string) {
    switch (role) {
      case 'DOCTOR':
        return this.prisma.doctor.findUnique({ where: { id } });
      case 'PATIENT':
        return this.prisma.patient.findUnique({ where: { id } });
      case 'ADMIN':
      case 'SUPERADMIN':
        return this.prisma.admin.findUnique({ where: { id } });
      default:
        return null;
    }
  }

  /**
   * Login (username/phone_number + password)
   */
  async signIn(role: string, username: string, password: string) {
    let user: any;

    if (role === 'DOCTOR') {
      user = await this.prisma.doctor.findUnique({
        where: { phone_number: username },
      });
    } else if (role === 'PATIENT') {
      user = await this.prisma.patient.findUnique({
        where: { phone_number: username },
      });
    } else if (role === 'ADMIN' || role === 'SUPERADMIN') {
      user = await this.prisma.admin.findUnique({ where: { username } });
    }

    if (!user) {
      throw new NotFoundException(`${role} not found`);
    }

    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: IToken = { id: user.id, role: role };
    const accessToken = await this.jwt.accessToken(payload);
    const refreshToken = await this.jwt.refreshToken(payload);

    return successRes({ accessToken, refreshToken });
  }

  /**
   * Refresh token orqali yangi access token olish
   */
  async newToken(token: string) {
    const data: any = await this.jwt.verifyToken(
      token,
      config.TOKEN.REFRESH_KEY,
    );
    if (!data) throw new UnauthorizedException('Refresh token expired');

    const user = await this.findUserByRole(data?.id, data?.role);
    if (!user) throw new ForbiddenException('Forbidden user');

    const payload: IToken = { id: user.id, role: data.role };
    const accessToken = await this.jwt.accessToken(payload);

    return successRes({ token: accessToken });
  }

  /**
   * Logout (cookie’dagi refresh tokenni tozalash)
   */
  async signOut(token: string, res: Response, tokenKey: string) {
    const data: any = await this.jwt.verifyToken(
      token,
      config.TOKEN.REFRESH_KEY,
    );
    if (!data) throw new UnauthorizedException('Refresh token expired');

    const user = await this.findUserByRole(data?.id, data?.role);
    if (!user) throw new ForbiddenException('Forbidden user');

    res.clearCookie(tokenKey);
    return successRes({});
  }
}
