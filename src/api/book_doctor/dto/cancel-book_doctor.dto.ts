import { IsInt } from 'class-validator';

export class CancelBookingDto {
  @IsInt()
  bookingId: number;

  @IsInt()
  patientId: number;
}
