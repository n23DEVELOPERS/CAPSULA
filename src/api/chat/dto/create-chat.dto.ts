import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsEnum, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { SendRole } from 'src/common/enum/index'

export class CreateChatDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    doctor_id: number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    patient_id: number;

    @ApiProperty({ example: SendRole.PATIENT, enum: SendRole })
    @IsEnum(SendRole)
    @IsNotEmpty()
    sender_role: SendRole;

    @ApiProperty({ example: "Assalomu aleykum" })
    @IsString()
    @IsNotEmpty()
    message: string;
}
