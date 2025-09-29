import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
})
export class AppModule {}
