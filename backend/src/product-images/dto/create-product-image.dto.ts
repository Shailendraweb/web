import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({ example: 'https://example.com/img.jpg' })
  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
