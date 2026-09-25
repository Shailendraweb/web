import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddCartItemDto } from './dto/add-item.dto';
import { UpdateCartItemDto } from './dto/update-item.dto';
import { User } from '../user/entities/user.entity';
import { ProductVariant } from '../product-variants/entities/product-variant.entity';
import { Inventory } from '../inventory/entities/inventory.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly itemRepo: Repository<CartItem>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    private readonly dataSource: DataSource,
  ) {}

/*   async getOrCreateCartForUser(user: User): Promise<Cart> {
    let cart = await this.cartRepo.findOne({ where: { user, status: 'active' }, relations: ['items', 'items.variant'] });
    if (!cart) {
      cart = this.cartRepo.create({ user, status: 'active', items: [] } as any);
      cart = await this.cartRepo.save(cart);
    }
    return cart;
  } */

async getOrCreateCartForUser(user: User): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
    where: {
      user: { id: user.id },
      status: 'active',
    },
    relations: {
      items: {
        variant: true,
      },
    },
  });

  if (!cart) {
    cart = this.cartRepo.create({
      user,
      status: 'active',
      items: [],
    });

    cart = await this.cartRepo.save(cart);
  }

  return cart;
} 

  async addItem(user: User, dto: AddCartItemDto) {
    const cart = await this.getOrCreateCartForUser(user);
    const variant = await this.variantRepo.findOneBy({ id: dto.variant_id });
    if (!variant) throw new BadRequestException('Variant not found');

    const inv = await this.inventoryRepo.findOne({ where: { variant: { id: variant.id } } as any });
    const available = inv ? inv.quantity - inv.reservedQuantity : 0;
    if (dto.quantity > available) throw new BadRequestException('Insufficient stock');

    const existing = await this.itemRepo.findOne({ where: { cart: { id: cart.id }, variant: { id: variant.id } } as any });
    if (existing) {
      existing.quantity = existing.quantity + dto.quantity;
      if (existing.quantity > available) throw new BadRequestException('Insufficient stock');
      return this.itemRepo.save(existing);
    }

    const item = this.itemRepo.create({ cart, variant, quantity: dto.quantity } as any);
    return this.itemRepo.save(item);
  }

  async updateItem(user: User, id: number, dto: UpdateCartItemDto) {
    const cart = await this.getOrCreateCartForUser(user);
    const item = await this.itemRepo.findOne({ where: { id, cart: { id: cart.id } } as any, relations: ['variant'] });
    if (!item) throw new NotFoundException('Cart item not found');

    if (dto.quantity !== undefined) {
      const inv = await this.inventoryRepo.findOne({ where: { variant: { id: item.variant.id } } as any });
      const available = inv ? inv.quantity - inv.reservedQuantity : 0;
      if (dto.quantity > available) throw new BadRequestException('Insufficient stock');
      item.quantity = dto.quantity;
    }

    return this.itemRepo.save(item);
  }

  async removeItem(user: User, id: number) {
    const cart = await this.getOrCreateCartForUser(user);
    const item = await this.itemRepo.findOne({ where: { id, cart: { id: cart.id } } as any });
    if (!item) throw new NotFoundException('Cart item not found');
    await this.itemRepo.remove(item);
  }

  async clearCart(user: User) {
    const cart = await this.getOrCreateCartForUser(user);
    await this.itemRepo.delete({ cart: { id: cart.id } } as any);
  }
}
