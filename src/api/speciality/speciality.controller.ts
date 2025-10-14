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
  NotFoundException,
} from '@nestjs/common';
import { SpecialityService } from './speciality.service';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CookieGetter } from 'src/common/decorator/cookie-getter.decorator';
import { TokenService } from 'src/infrastructure/token/Token';
import { config } from 'src/config';

@Controller('speciality')
export class SpecialityController {
  constructor(
    private readonly specialityService: SpecialityService,
    private readonly token: TokenService,
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Post()
  @ApiBearerAuth()
  create(@Body() createSpecialityDto: CreateSpecialityDto) {
    return this.specialityService.createSpec(createSpecialityDto);
  }

  @Get()
  async findAll(@CookieGetter('authKey') token: string) {
    const decoded: any = await this.token.verifyToken(
      token,
      config.TOKEN.REFRESH_KEY,
    );
    if (decoded.role === Roles.ADMIN || decoded.role === Roles.SUPERADMIN) {
      return this.specialityService.findAll();
    } else {
      return this.specialityService.findAll({
        where: { is_active: true },
      });
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @CookieGetter('authKey') token: string,
  ) {
    const decoded: any = await this.token.verifyToken(
      token,
      config.TOKEN.REFRESH_KEY,
    );
    if (decoded.role === Roles.ADMIN || decoded.role === Roles.SUPERADMIN) {
      return this.specialityService.findOneById(id);
    } else {
      let spec = await this.specialityService.findOneById(id);
      let dt = spec.data as any;

      if (dt.is_active === false) {
        throw new NotFoundException('Speciality not found');
      } else {
        return spec;
      }
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Patch(':id')
  @ApiBearerAuth()
  update(
    @Param('id') id: number,
    @Body() updateSpecialityDto: UpdateSpecialityDto,
  ) {
    return this.specialityService.updateSpec(id, updateSpecialityDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: number) {
    return this.specialityService.delete(id);
  }
}
