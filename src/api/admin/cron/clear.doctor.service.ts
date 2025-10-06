// cleanup.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Har hafta yakshanba kuni soat 02:00 da ishga tushadi
  @Cron(CronExpression.EVERY_WEEK)
  async handleWeeklyCleanup() {
    try {
      const result = await this.prisma.doctor.deleteMany({
        where: { is_delete: true },
      });

      this.logger.log(
        `✅ Tozalash tugadi: ${result.count} ta yozuv occhirildi.`,
      );
    } catch (error) {
      this.logger.error('❌ Tozalashda xatolik:', error);
    }
  }
}
