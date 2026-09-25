import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { Subcategory } from './entities/subcategory.entity';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
  ) {}

  create(createSubcategoryDto: CreateSubcategoryDto): Promise<Subcategory> {
    const entity = new Subcategory();
    entity.name = createSubcategoryDto.name;
    entity.description = createSubcategoryDto.description;
    entity.categoryId = createSubcategoryDto.categoryId;
    entity.status = createSubcategoryDto.status ?? entity.status;
    return this.subcategoryRepository.save(entity);
  }

  findAll(): Promise<Subcategory[]> {
    return this.subcategoryRepository.find();
  }

  async findOne(id: number): Promise<Subcategory> {
    const entity = await this.subcategoryRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Subcategory with ID ${id} not found`);
    }
    return entity;
  }

  async update(id: number, dto: UpdateSubcategoryDto): Promise<Subcategory> {
    const entity = await this.subcategoryRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Subcategory with ID ${id} not found`);
    }
    Object.assign(entity, dto);
    return this.subcategoryRepository.save(entity);
  }

  async remove(id: number): Promise<void> {
    const result = await this.subcategoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Subcategory with ID ${id} not found`);
    }
  }
}
