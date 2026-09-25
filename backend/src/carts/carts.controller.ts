import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartsService } from './carts.service';
import { AddCartItemDto } from './dto/add-item.dto';
import { UpdateCartItemDto } from './dto/update-item.dto';

@ApiTags('Cart')
@Controller('api/v1/cart')
export class CartsController {
  constructor(private readonly service: CartsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  getCart(@Req() req: any) {
    return this.service.getOrCreateCartForUser(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('items')
  addItem(@Req() req: any, @Body() dto: AddCartItemDto) {
    return this.service.addItem(req.user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('items/:id')
  updateItem(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateCartItemDto) {
    return this.service.updateItem(req.user, Number(id), dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('items/:id')
  removeItem(@Req() req: any, @Param('id') id: string) {
    return this.service.removeItem(req.user, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete()
  clearCart(@Req() req: any) {
    return this.service.clearCart(req.user);
  }
}
