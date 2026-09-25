import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly repo: Repository<Coupon>,
  ) {}

  create(dto: CreateCouponDto) {
    const c = this.repo.create({ ...dto, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null } as any);
    return this.repo.save(c);
  }

  findOneByCode(code: string) {
    return this.repo.findOne({ where: { code } as any });
  }

  apply(code: string, subtotal: number) {
    return this.findOneByCode(code).then(c => {
      if (!c) throw new BadRequestException('Invalid coupon');
      if (c.expiresAt && c.expiresAt.getTime() < Date.now()) throw new BadRequestException('Coupon expired');
      let discount = 0;
      if (c.amountOff) discount = Number(c.amountOff);
      if (c.percentOff) discount = Math.max(discount, (subtotal * Number(c.percentOff)) / 100);
      return { discount, coupon: c };
    });
  }
}
