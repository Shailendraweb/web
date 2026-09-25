import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductImagesService } from './product-images.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

@ApiTags('ProductImages')
@Controller('api/v1')
export class ProductImagesController {
  constructor(private readonly service: ProductImagesService) {}

  @Post('products/:productId/images')
  @ApiOperation({ summary: 'Create product image' })
  create(@Param('productId') productId: string, @Body() dto: CreateProductImageDto) {
    return this.service.create(Number(productId), dto);
  }

  @Get('products/:productId/images')
  @ApiOperation({ summary: 'List images for product' })
  findByProduct(@Param('productId') productId: string) {
    return this.service.findByProduct(Number(productId));
  }

  @Patch('product-images/:id')
  update(@Param('id') id: string, @Body() dto: UpdateProductImageDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete('product-images/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
