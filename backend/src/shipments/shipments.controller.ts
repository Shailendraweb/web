import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';

@ApiTags('Shipments')
@Controller('api/v1')
export class ShipmentsController {
  constructor(private readonly service: ShipmentsService) {}

  @Post('orders/:orderId/shipments')
  create(@Param('orderId') orderId: string, @Body() dto: CreateShipmentDto) {
    return this.service.create(Number(orderId), dto);
  }

  @Get('orders/:orderId/shipments')
  findByOrder(@Param('orderId') orderId: string) {
    return this.service.findByOrder(Number(orderId));
  }

  @Get('shipments/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Patch('shipments/:id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.service.updateStatus(Number(id), body.status);
  }
}
