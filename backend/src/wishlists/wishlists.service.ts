import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly repo: Repository<Wishlist>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async add(user: User, productId: number) {
    const product = await this.productRepo.findOneBy({ id: productId });
    if (!product) throw new BadRequestException('Product not found');
    const existing = await this.repo.findOne({ where: { user: { id: user.id }, product: { id: productId } } as any });
    if (existing) return existing;
    const w = this.repo.create({ user, product } as any);
    return this.repo.save(w);
  }

  async remove(user: User, productId: number) {
    const existing = await this.repo.findOne({ where: { user: { id: user.id }, product: { id: productId } } as any });
    if (!existing) return;
    await this.repo.remove(existing);
  }

  list(user: User) {
    return this.repo.find({ where: { user: { id: user.id } } as any, relations: ['product'] });
  }
}
