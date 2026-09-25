import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { SubcategoryStatus } from '../entities/subcategory.entity';

export class CreateSubcategoryDto {
  @ApiProperty({ example: 'Smartphones', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Mobile phones and accessories', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: SubcategoryStatus.ACTIVE, enum: SubcategoryStatus, required: false })
  @IsOptional()
  @IsEnum(SubcategoryStatus)
  status?: SubcategoryStatus;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
