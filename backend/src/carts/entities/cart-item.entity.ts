import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Cart } from './cart.entity';
import { ProductVariant } from '../../product-variants/entities/product-variant.entity';

@Entity({ name: 'cart_items' })
@Unique(['cart', 'variant'])
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, { nullable: false, onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => ProductVariant, { nullable: false, onDelete: 'RESTRICT' })
  variant: ProductVariant;

  @Column({ type: 'int' })
  quantity: number;
}
