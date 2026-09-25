import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { BrandStatus } from '../entities/brand.entity';

export class CreateBrandDto {
  @ApiProperty({ example: 'Apple', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Electronics and devices', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: BrandStatus.ACTIVE, enum: BrandStatus, required: false })
  @IsOptional()
  @IsEnum(BrandStatus)
  status?: BrandStatus;
}
