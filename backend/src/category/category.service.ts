import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { Category, CategoryStatus } from './entities/category.entity';
import { SubcategoryStatus } from 'src/subcategory/entities/subcategory.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = new Category();
    category.name = createCategoryDto.name;
    category.description = createCategoryDto.description;
    category.status = createCategoryDto.status ?? category.status;
    return this.categoryRepository.save(category);
  }

/*   findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  } */

/*   async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: {
        subcategories: true,
      },
    });
  } */

  async findAll(): Promise<Category[]> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect(
        'category.subcategories',
        'subcategory',
        'subcategory.status = :status',
        { status: SubcategoryStatus.ACTIVE },
      )
      .where('category.status = :categoryStatus', {
        categoryStatus: CategoryStatus.ACTIVE,
      })
      .getMany();
  }

  async findOne(id: number): Promise<Category> {
    //const category = await this.categoryRepository.findOneBy({ id });
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        subcategories: true,
      },
    });
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        subcategories: true,
      },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
