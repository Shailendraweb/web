import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { Subcategory } from './entities/subcategory.entity';

@ApiTags('Subcategories')
@Controller('api/v1/subcategories')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new subcategory' })
  @ApiResponse({ status: 201, description: 'Subcategory created', type: Subcategory })
  create(@Body() dto: CreateSubcategoryDto): Promise<Subcategory> {
    return this.subcategoryService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subcategories' })
  @ApiResponse({ status: 200, description: 'Subcategories retrieved', type: Subcategory, isArray: true })
  findAll(): Promise<Subcategory[]> {
    return this.subcategoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a subcategory by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Subcategory found', type: Subcategory })
  findOne(@Param('id') id: string): Promise<Subcategory> {
    return this.subcategoryService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subcategory' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Subcategory updated', type: Subcategory })
  update(@Param('id') id: string, @Body() dto: UpdateSubcategoryDto): Promise<Subcategory> {
    return this.subcategoryService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subcategory' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Subcategory deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.subcategoryService.remove(+id);
  }
}
