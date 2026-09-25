import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('Addresses')
@Controller('api/v1/addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create address for authenticated user' })
  @ApiResponse({ status: 201, description: 'Address created' })
  create(@Req() req: any, @Body() dto: CreateAddressDto) {
    return this.addressesService.create(req.user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get addresses for authenticated user' })
  findAll(@Req() req: any) {
    return this.addressesService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.addressesService.findOne(req.user, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.addressesService.update(req.user, +id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Req() req: any, @Param('id') id: string) {
    return this.addressesService.remove(req.user, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/soft')
  @ApiBearerAuth()
  softDelete(@Req() req: any, @Param('id') id: string) {
    return this.addressesService.softDelete(req.user, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/default')
  @ApiBearerAuth()
  makeDefault(@Req() req: any, @Param('id') id: string) {
    return this.addressesService.makeDefault(req.user, +id);
  }
}
