import { IsInt, IsDate, IsNotEmpty } from 'class-validator';

export class RescheduleBookingDto {
  @IsInt()
  bookingId: number;

  @IsInt()
  patientId: number;

  @IsNotEmpty()
  @IsDate()
  newDate: Date;
}
