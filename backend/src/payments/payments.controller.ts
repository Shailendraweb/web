import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@ApiTags('Payments')
@Controller('api/v1')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('orders/:orderId/payments')
  @ApiOperation({ summary: 'Create payment for order' })
  create(@Param('orderId') orderId: string, @Body() dto: CreatePaymentDto) {
    return this.service.create(Number(orderId), dto);
  }

  @Get('orders/:orderId/payments')
  findByOrder(@Param('orderId') orderId: string) {
    return this.service.findByOrder(Number(orderId));
  }

  @Get('payments/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }
}
