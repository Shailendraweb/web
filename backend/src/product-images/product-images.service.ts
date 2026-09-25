import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly repo: Repository<ProductImage>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(productId: number, dto: CreateProductImageDto): Promise<ProductImage> {
    const product = await this.productRepo.findOneBy({ id: productId });
    if (!product) throw new BadRequestException('Product not found');

    const img = this.repo.create({ product, imageUrl: dto.imageUrl, sortOrder: dto.sortOrder ?? 0 } );
    return this.repo.save(img);
  }

  findByProduct(productId: number): Promise<ProductImage[]> {
    return this.repo.find({ where: { product: { id: productId } }, order: { sortOrder: 'ASC' } });
  }

  async update(id: number, dto: UpdateProductImageDto): Promise<ProductImage> {
    const img = await this.repo.findOne({ where: { id }, relations: ['product'] });
    if (!img) throw new NotFoundException('Image not found');
    Object.assign(img, dto);
    return this.repo.save(img);
  }

  async remove(id: number): Promise<void> {
    const img = await this.repo.findOneBy({ id });
    if (!img) throw new NotFoundException('Image not found');
    await this.repo.remove(img);
  }
}
