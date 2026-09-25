import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { ProductVariant } from '../product-variants/entities/product-variant.entity';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { ReserveInventoryDto } from './dto/reserve-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    private readonly dataSource: DataSource,
  ) {}

/*   async ensureInventoryForVariant(variantId: number): Promise<Inventory> {
    const variant = await this.variantRepo.findOneBy({ id: variantId });
    if (!variant) throw new NotFoundException('Variant not found');
    let inv = await this.inventoryRepo.findOne({ where: { variant: { id: variantId } } as any });
    if (!inv) {
      inv = this.inventoryRepo.create({ variant, quantity: 0, reservedQuantity: 0 } as any);
      inv = await this.inventoryRepo.save(inv);
    }
    return inv;
  } */

async ensureInventoryForVariant(
  variantId: number,
): Promise<Inventory> {
  const variant = await this.variantRepo.findOne({
    where: { id: variantId },
  });

  if (!variant) {
    throw new NotFoundException('Variant not found');
  }

  let inventory = await this.inventoryRepo.findOne({
    where: {
      variant: {
        id: variantId,
      },
    },
  });

  if (!inventory) {
    inventory = this.inventoryRepo.create({
      variant,
      quantity: 0,
      reservedQuantity: 0,
    });

    inventory = await this.inventoryRepo.save(inventory);
  }

  return inventory;
}

  getAvailable(inv: Inventory) {
    return inv.quantity - inv.reservedQuantity;
  }

  async adjust(variantId: number, dto: AdjustInventoryDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const inv = await queryRunner.manager.findOne(Inventory, { where: { variant: { id: variantId } } as any, lock: { mode: 'pessimistic_write' } });
      if (!inv) throw new NotFoundException('Inventory record not found');
      if (dto.quantity < inv.reservedQuantity) throw new BadRequestException('Quantity cannot be less than reserved quantity');
      inv.quantity = dto.quantity;
      const saved = await queryRunner.manager.save(inv);
      await queryRunner.commitTransaction();
      return saved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async reserve(variantId: number, dto: ReserveInventoryDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let inv = await queryRunner.manager.findOne(Inventory, { where: { variant: { id: variantId } } as any, lock: { mode: 'pessimistic_write' } });
      if (!inv) {
        const variant = await queryRunner.manager.findOne(ProductVariant, { where: { id: variantId } } as any);
        if (!variant) throw new NotFoundException('Variant not found');
        inv = queryRunner.manager.create(Inventory, { variant, quantity: 0, reservedQuantity: 0 } as any);
      }
      const available = inv.quantity - inv.reservedQuantity;
      if (dto.quantity > available) throw new BadRequestException('Insufficient stock');
      inv.reservedQuantity += dto.quantity;
      const saved = await queryRunner.manager.save(inv);
      await queryRunner.commitTransaction();
      return saved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async release(variantId: number, dto: ReserveInventoryDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const inv = await queryRunner.manager.findOne(Inventory, { where: { variant: { id: variantId } } as any, lock: { mode: 'pessimistic_write' } });
      if (!inv) throw new NotFoundException('Inventory record not found');
      inv.reservedQuantity = Math.max(0, inv.reservedQuantity - dto.quantity);
      const saved = await queryRunner.manager.save(inv);
      await queryRunner.commitTransaction();
      return saved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  findAll(): Promise<Inventory[]> {
    return this.inventoryRepo.find({ relations: ['variant'] });
  }

  /* findOneByVariant(variantId: number): Promise<Inventory> {
    return this.inventoryRepo.findOne({ where: { variant: { id: variantId } } as any, relations: ['variant'] });
  } */

    findOneByVariant(variantId: number): Promise<Inventory | null> {
        return this.inventoryRepo.findOne({
            where: {
                variant: {
                    id: variantId,
                },
            },
            relations: {
                variant: true,
            },
        });
    }
}
