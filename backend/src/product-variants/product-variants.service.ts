import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from './entities/product-variant.entity';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductVariantDto): Promise<ProductVariant> {
    const product = await this.productRepository.findOneBy({ id: dto.productId });
    if (!product) throw new BadRequestException('Product not found');

    const exists = await this.variantRepository.findOne({ where: { sku: dto.sku } });
    if (exists) throw new BadRequestException('SKU already exists');

    const variant = this.variantRepository.create({
      product,
      sku: dto.sku,
      price: dto.price,
      comparePrice: dto.comparePrice ?? null,
    } as Partial<ProductVariant>);

    return this.variantRepository.save(variant);
  }

  findByProduct(productId: number): Promise<ProductVariant[]> {
    return this.variantRepository.find({ where: { product: { id: productId } } as any });
  }

  async findOne(id: number): Promise<ProductVariant> {
    const v = await this.variantRepository.findOne({ where: { id }, relations: ['product'] });
    if (!v) throw new NotFoundException('Variant not found');
    return v;
  }

  async update(id: number, dto: UpdateProductVariantDto): Promise<ProductVariant> {
    const v = await this.findOne(id);
    if (dto.sku && dto.sku !== v.sku) {
      const exists = await this.variantRepository.findOne({ where: { sku: dto.sku } });
      if (exists) throw new BadRequestException('SKU already exists');
    }
    Object.assign(v, dto);
    return this.variantRepository.save(v);
  }

  async remove(id: number): Promise<void> {
    const v = await this.findOne(id);
    await this.variantRepository.remove(v);
  }
}
