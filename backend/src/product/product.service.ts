import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductStatus } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const entity = new Product();
    entity.name = dto.name;
    entity.description = dto.description;
    entity.status = dto.status ?? ProductStatus.ACTIVE;

    entity.slug = dto.slug ?? dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 150);

    if (dto.categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: dto.categoryId });
      if (!category) throw new BadRequestException('Category not found');
      entity.category = category;
    }

    return this.productRepository.save(entity);
  }

  async findAll(query?: any): Promise<{ data: Product[]; meta: any }> {
    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.min(100, Number(query?.limit) || 20);

    const qb = this.productRepository.createQueryBuilder('product').leftJoinAndSelect('product.category', 'category');

    if (query?.category_id) qb.andWhere('category.id = :cid', { cid: Number(query.category_id) });
    if (query?.status) qb.andWhere('product.status = :status', { status: query.status });
    if (query?.search) qb.andWhere('product.name ILIKE :q OR product.description ILIKE :q', { q: `%${query.search}%` });

    const [data, total] = await qb
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, meta: { total, page, limit } };
  }

  async findOne(id: number): Promise<Product> {
    const entity = await this.productRepository.findOne({ where: { id }, relations: ['category'] });
    if (!entity) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return entity;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const entity = await this.productRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    if (dto.categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: dto.categoryId });
      if (!category) throw new BadRequestException('Category not found');
      (entity as any).category = category;
    }

    if (dto.slug) entity.slug = dto.slug;

    Object.assign(entity, { name: dto.name ?? entity.name, description: dto.description ?? entity.description, status: dto.status ?? entity.status });
    return this.productRepository.save(entity);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
