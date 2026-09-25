import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductVariantsService } from './product-variants.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

@ApiTags('ProductVariants')
@Controller('api/v1')
export class ProductVariantsController {
  constructor(private readonly service: ProductVariantsService) {}

  @Post('products/:productId/variants')
  @ApiOperation({ summary: 'Create product variant' })
  create(@Param('productId') productId: string, @Body() dto: CreateProductVariantDto) {
    dto.productId = Number(productId);
    return this.service.create(dto);
  }

  @Get('products/:productId/variants')
  @ApiOperation({ summary: 'List product variants for product' })
  findByProduct(@Param('productId') productId: string) {
    return this.service.findByProduct(Number(productId));
  }

  @Get('product-variants/:id')
  @ApiOperation({ summary: 'Get variant by id' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Patch('product-variants/:id')
  update(@Param('id') id: string, @Body() dto: UpdateProductVariantDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete('product-variants/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
