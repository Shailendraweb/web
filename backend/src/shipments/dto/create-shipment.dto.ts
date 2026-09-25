import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateShipmentDto {
  @ApiProperty({ example: 'UPS' })
  @IsString()
  carrier: string;

  @ApiProperty({ example: '1Z999AA10123456784', required: false })
  @IsOptional()
  @IsString()
  tracking_number?: string;
}
