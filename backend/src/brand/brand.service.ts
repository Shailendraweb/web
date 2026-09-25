import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  create(dto: CreateBrandDto): Promise<Brand> {
    const entity = new Brand();
    entity.name = dto.name;
    entity.description = dto.description;
    entity.status = dto.status ?? entity.status;
    return this.brandRepository.save(entity);
  }

  findAll(): Promise<Brand[]> {
    return this.brandRepository.find();
  }

  async findOne(id: number): Promise<Brand> {
    const entity = await this.brandRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return entity;
  }

  async update(id: number, dto: UpdateBrandDto): Promise<Brand> {
    const entity = await this.brandRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    Object.assign(entity, dto);
    return this.brandRepository.save(entity);
  }

  async remove(id: number): Promise<void> {
    const result = await this.brandRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
  }
}
