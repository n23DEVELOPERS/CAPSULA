import { Module } from '@nestjs/common';
import { BookDokctorController } from './book_dokctor.controller';
import { BookDokctorServic } from './book_dokctor.service';
import { TokenService } from 'src/infrastructure/token/Token';

@Module({
  controllers: [BookDokctorController],
  providers: [BookDokctorServic, TokenService],
})
export class BookDokctorModule {}
