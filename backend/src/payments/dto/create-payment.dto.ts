import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 'stripe' })
  @IsString()
  provider: string;

  @ApiProperty({ example: 'txn_123', required: false })
  @IsString()
  transaction_id?: string;

  @ApiProperty({ example: '100.00' })
  @IsNumberString()
  amount: string;
}
