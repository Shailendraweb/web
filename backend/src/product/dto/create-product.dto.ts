import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ProductStatus } from '../entities/product.entity';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 13', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Latest Apple smartphone', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: ProductStatus.ACTIVE, enum: ProductStatus, required: false })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiProperty({ example: 'electronics' , required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  subCategoryId?: number;
  
}
