import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString, IsInt } from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({ example: 'SUMMER10' })
  @IsString()
  code: string;

  @ApiProperty({ example: '10.00', required: false })
  @IsOptional()
  @IsNumberString()
  amountOff?: string;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsInt()
  percentOff?: number;

  @ApiProperty({ example: '2024-12-31T23:59:59Z', required: false })
  @IsOptional()
  expiresAt?: string;
}
