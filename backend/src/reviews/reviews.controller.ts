import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('Reviews')
@Controller('api/v1')
export class ReviewsController {
  constructor(private readonly service: ReviewsService) {}

  @Post('products/:productId/reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Req() req: any, @Param('productId') productId: string, @Body() dto: CreateReviewDto) {
    return this.service.create(req.user, Number(productId), dto);
  }

  @Get('products/:productId/reviews')
  findByProduct(@Param('productId') productId: string) {
    return this.service.findByProduct(Number(productId));
  }

  @Get('reviews/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Patch('reviews/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Req() req: any, @Param('id') id: string, @Body() dto: CreateReviewDto) {
    return this.service.update(req.user, Number(id), dto);
  }

  @Delete('reviews/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user, Number(id));
  }
}
