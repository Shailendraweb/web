import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly repo: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async create(orderId: number, dto: CreatePaymentDto) {
    const order = await this.orderRepo.findOneBy({ id: orderId });
    if (!order) throw new BadRequestException('Order not found');
    // validate amount matches order
    if (Number(dto.amount) !== Number(order.total)) throw new BadRequestException('Invalid payment amount');

    const payment = this.repo.create({ order, provider: dto.provider, transactionId: dto.transaction_id ?? null, amount: dto.amount, status: 'pending' } as any);
    return this.repo.save(payment);
  }

  findByOrder(orderId: number) {
    return this.repo.find({ where: { order: { id: orderId } } as any });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } as any, relations: ['order'] });
  }
}
