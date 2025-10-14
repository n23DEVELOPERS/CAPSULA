import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber} from 'class-validator';
import { BookDoctorStatus } from 'src/common/enum';

export class UpdateBookStatus {
  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  book_id: number;

  @ApiProperty({
    example: 'PROCESS',
  })
  @IsEnum(BookDoctorStatus)
  @IsNotEmpty()
  status: BookDoctorStatus;
}