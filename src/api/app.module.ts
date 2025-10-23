import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [PrismaModule, ChatModule],
})
export class AppModule {}
