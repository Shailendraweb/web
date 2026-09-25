import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 5 })
  @IsInt()
  address_id: number;
}
