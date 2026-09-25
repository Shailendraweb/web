import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WishlistsService } from './wishlists.service';

@ApiTags('Wishlists')
@Controller('api/v1')
export class WishlistsController {
  constructor(private readonly service: WishlistsService) {}

  @Post('products/:productId/wishlist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  add(@Req() req: any, @Param('productId') productId: string) {
    return this.service.add(req.user, Number(productId));
  }

  @Delete('products/:productId/wishlist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Req() req: any, @Param('productId') productId: string) {
    return this.service.remove(req.user, Number(productId));
  }

  @Get('wishlist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  list(@Req() req: any) {
    return this.service.list(req.user);
  }
}
