import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cart } from '../carts/entities/cart.entity';
import { CartItem } from '../carts/entities/cart-item.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { User } from '../user/entities/user.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { ProductVariant } from '../product-variants/entities/product-variant.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    private readonly dataSource: DataSource,
  ) {}

  /* async createOrder(user: User, addressId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const cart = await queryRunner.manager.findOne(Cart, { where: { user: { id: user.id }, status: 'active' }, relations: ['items', 'items.variant'] } as any);
      if (!cart || !cart.items || cart.items.length === 0) throw new BadRequestException('Cart is empty');

      // validate variants and inventory
      let subtotal = 0;
      for (const item of cart.items) {
        const variant = await queryRunner.manager.findOne(ProductVariant, { where: { id: item.variant.id } } as any);
        if (!variant) throw new BadRequestException('Variant not found: ' + item.variant.id);
        const inv = await queryRunner.manager.findOne(Inventory, { where: { variant: { id: variant.id } } as any, lock: { mode: 'pessimistic_write' } });
        const available = inv ? inv.quantity - inv.reservedQuantity : 0;
        if (item.quantity > available) throw new BadRequestException('Insufficient stock for variant ' + variant.id);
        subtotal += Number(variant.price) * item.quantity;
      }

      const tax = +(subtotal * 0.05).toFixed(2); // example 5% tax
      const shipping = 10.0; // flat shipping for example
      const total = +(subtotal + tax + shipping).toFixed(2);

      const order = queryRunner.manager.create(Order, {
        user,
        addressId,
        status: 'pending',
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
      } as any);

      const savedOrder = await queryRunner.manager.save(order);

      // create order items and decrement inventory
      for (const item of cart.items) {
        const variant = await queryRunner.manager.findOne(ProductVariant, { where: { id: item.variant.id } } as any);
        const inv = await queryRunner.manager.findOne(Inventory, { where: { variant: { id: variant.id } } as any, lock: { mode: 'pessimistic_write' } });
        const orderItem = queryRunner.manager.create(OrderItem, {
          order: savedOrder,
          variant,
          productName: (variant as any).product?.name ?? 'product',
          sku: variant.sku,
          price: variant.price,
          quantity: item.quantity,
        } as any);
        await queryRunner.manager.save(orderItem);

        if (inv) {
          inv.quantity = inv.quantity - item.quantity;
          if (inv.quantity < 0) throw new BadRequestException('Negative inventory after order');
          await queryRunner.manager.save(inv);
        }
      }

      // clear cart
      await queryRunner.manager.delete(CartItem, { cart: { id: cart.id } } as any);

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  } */

async createOrder(user: User, addressId: number) {
  const queryRunner = this.dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const cart = await queryRunner.manager.findOne(Cart, {
      where: {
        user: {
          id: user.id,
        },
        status: 'active',
      },
      relations: {
        items: {
          variant: true,
        },
      },
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    let subtotal = 0;

    // Validate variants and inventory
    for (const item of cart.items) {
      const variant = await queryRunner.manager.findOne(ProductVariant, {
        where: {
          id: item.variant.id,
        },
      });

      if (!variant) {
        throw new BadRequestException(
          'Variant not found: ' + item.variant.id,
        );
      }

      const inv = await queryRunner.manager.findOne(Inventory, {
        where: {
          variant: {
            id: variant.id,
          },
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      const available = inv
        ? inv.quantity - inv.reservedQuantity
        : 0;

      if (item.quantity > available) {
        throw new BadRequestException(
          'Insufficient stock for variant ' + variant.id,
        );
      }

      subtotal += Number(variant.price) * item.quantity;
    }

    const tax = +(subtotal * 0.05).toFixed(2);
    const shipping = 10.0;
    const total = +(subtotal + tax + shipping).toFixed(2);

    const order = queryRunner.manager.create(Order, {
      user,
      addressId,
      status: 'pending',
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
    });

    const savedOrder = await queryRunner.manager.save(order);

    // Create order items and decrement inventory
    for (const item of cart.items) {
      const variant = await queryRunner.manager.findOne(ProductVariant, {
        where: {
          id: item.variant.id,
        },
      });

      if (!variant) {
        throw new BadRequestException(
          'Variant not found: ' + item.variant.id,
        );
      }

      const inv = await queryRunner.manager.findOne(Inventory, {
        where: {
          variant: {
            id: variant.id,
          },
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      const orderItem = queryRunner.manager.create(OrderItem, {
        order: savedOrder,
        variant,
        productName: 'product',
        sku: variant.sku,
        price: variant.price,
        quantity: item.quantity,
      });

      await queryRunner.manager.save(orderItem);

      if (inv) {
        inv.quantity = inv.quantity - item.quantity;

        if (inv.quantity < 0) {
          throw new BadRequestException(
            'Negative inventory after order',
          );
        }

        await queryRunner.manager.save(inv);
      }
    }

    // Clear cart
    await queryRunner.manager.delete(CartItem, {
      cart: {
        id: cart.id,
      },
    });

    await queryRunner.commitTransaction();

    return savedOrder;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}

  findOrdersForUser(user: User, query?: any) {
    return this.orderRepo.find({ where: { user }, relations: ['items'] });
  }

  async findOne(user: User, id: number) {
    const order = await this.orderRepo.findOne({ where: { id, user }, relations: ['items'] });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
