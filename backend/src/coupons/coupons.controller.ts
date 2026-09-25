import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';

@ApiTags('Coupons')
@Controller('api/v1')
export class CouponsController {
  constructor(private readonly service: CouponsService) {}

  @Post('coupons')
  create(@Body() dto: CreateCouponDto) {
    return this.service.create(dto);
  }

  @Get('coupons/:code')
  find(@Param('code') code: string) {
    return this.service.findOneByCode(code);
  }

  @Get('coupons/:code/apply')
  apply(@Param('code') code: string, @Query('subtotal') subtotal: string) {
    return this.service.apply(code, Number(subtotal));
  }
}
