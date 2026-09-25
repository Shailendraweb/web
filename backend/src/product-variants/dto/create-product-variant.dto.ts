import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumberString, IsOptional, Min } from 'class-validator';

export class CreateProductVariantDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  productId: number;

  @ApiProperty({ example: 'SKU-001' })
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: '199.99' })
  @IsNotEmpty()
  @IsNumberString()
  price: string;

  @ApiProperty({ example: '249.99', required: false })
  @IsOptional()
  @IsNumberString()
  comparePrice?: string;
}
