import { Module } from '@nestjs/common';
import { BookDokctorController } from './book_dokctor.controller';
import { BookDokctorServic } from './book_dokctor.service';

@Module({
  controllers: [BookDokctorController],
  providers: [BookDokctorServic],
  
})
export class BookDokctorModule {}
