import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { SubcategoryStatus } from '../entities/subcategory.entity';

export class UpdateSubcategoryDto {
  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: SubcategoryStatus })
  @IsOptional()
  @IsEnum(SubcategoryStatus)
  status?: SubcategoryStatus;

  @ApiPropertyOptional({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
