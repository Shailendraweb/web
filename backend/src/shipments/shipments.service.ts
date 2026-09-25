import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './entities/shipment.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private readonly repo: Repository<Shipment>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async create(orderId: number, dto: CreateShipmentDto) {
    const order = await this.orderRepo.findOneBy({ id: orderId });
    if (!order) throw new BadRequestException('Order not found');
    const shipment = this.repo.create({ order, carrier: dto.carrier, trackingNumber: dto.tracking_number ?? null, status: 'pending' } as any);
    return this.repo.save(shipment);
  }

  findByOrder(orderId: number) {
    return this.repo.find({ where: { order: { id: orderId } } as any });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } as any, relations: ['order'] });
  }

  async updateStatus(id: number, status: string) {
    const s = await this.findOne(id);
    if (!s) throw new NotFoundException('Shipment not found');
    s.status = status;
    return this.repo.save(s);
  }
}
