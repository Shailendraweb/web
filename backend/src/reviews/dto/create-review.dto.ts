import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Great product', required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}
