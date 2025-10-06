import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum';
import { SignInDto } from './dto/signin.dto';
import { AuthService } from '../auth/auth..service';
import type { Response } from 'express';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { VerifyApplicationDto } from './dto/verify-application.dto';
import { CookieGetter } from 'src/common/decorator/cookie-getter.decorator';
import { stringify } from 'querystring';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly auth: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN)
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Post('signin')
  signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.signIn(signInDto.username, signInDto.password, res);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN)
  @ApiBearerAuth()
  @Post('new-token')
  newToken(@CookieGetter('authKey') token: string) {
    return this.auth.newToken(token);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN)
  @ApiBearerAuth()
  @Post('signout')
  signOut(
    @CookieGetter('authKey') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.signOut(token, res, 'authKey');
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN)
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Get('applications')
  findAllApplications() {
    return this.prisma.doctor.findMany({
      where: { is_active: false, is_delete: false },
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Patch('verify-application/:id')
  verifyApplication(
    @Param('id') id: number,
    @Body() body: VerifyApplicationDto,
  ) {
    return this.adminService.verifyApplication(id, body.isVerified);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, 'ID')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, 'ID')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.updateAdmin(id, updateAdminDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, 'ID')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.adminService.delete(id);
  }
}
