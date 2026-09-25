import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly repo: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(user: User, productId: number, dto: CreateReviewDto) {
    const product = await this.productRepo.findOneBy({ id: productId });
    if (!product) throw new BadRequestException('Product not found');

    const existing = await this.repo.findOne({ where: { user: { id: user.id }, product: { id: productId } } as any });
    if (existing) throw new BadRequestException('User already reviewed this product');

    const review = this.repo.create({ user, product, rating: dto.rating, comment: dto.comment } as any);
    return this.repo.save(review);
  }

  findByProduct(productId: number) {
    return this.repo.find({ where: { product: { id: productId } } as any });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } as any });
  }

  async update(user: User, id: number, dto: CreateReviewDto) {
    const review = await this.repo.findOne({ where: { id }, relations: ['user'] } as any);
    if (!review) throw new NotFoundException('Review not found');
    if (review.user.id !== user.id) throw new BadRequestException('Not allowed');
    Object.assign(review, dto);
    return this.repo.save(review);
  }

  async remove(user: User, id: number) {
    const review = await this.repo.findOne({ where: { id }, relations: ['user'] } as any);
    if (!review) throw new NotFoundException('Review not found');
    if (review.user.id !== user.id) throw new BadRequestException('Not allowed');
    await this.repo.remove(review);
  }
}
