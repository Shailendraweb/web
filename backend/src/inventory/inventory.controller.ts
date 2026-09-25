import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { ReserveInventoryDto } from './dto/reserve-inventory.dto';

@ApiTags('Inventory')
@Controller('api/v1/inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create inventory record for variant' })
  create(@Body() dto: AdjustInventoryDto & { variantId: number }) {
    return this.service.adjust(dto.variantId, { quantity: dto.quantity });
  }

  @Get()
  @ApiOperation({ summary: 'List inventory' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':variantId')
  @ApiOperation({ summary: 'Get inventory for variant' })
  findOne(@Param('variantId') variantId: string) {
    return this.service.findOneByVariant(Number(variantId));
  }

  @Patch(':variantId')
  @ApiOperation({ summary: 'Adjust inventory for variant' })
  adjust(@Param('variantId') variantId: string, @Body() dto: AdjustInventoryDto) {
    return this.service.adjust(Number(variantId), dto);
  }

  @Post(':variantId/adjust')
  adjustAlias(@Param('variantId') variantId: string, @Body() dto: AdjustInventoryDto) {
    return this.service.adjust(Number(variantId), dto);
  }

  @Post(':variantId/reserve')
  reserve(@Param('variantId') variantId: string, @Body() dto: ReserveInventoryDto) {
    return this.service.reserve(Number(variantId), dto);
  }

  @Post(':variantId/release')
  release(@Param('variantId') variantId: string, @Body() dto: ReserveInventoryDto) {
    return this.service.release(Number(variantId), dto);
  }
}
