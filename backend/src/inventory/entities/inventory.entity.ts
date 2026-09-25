import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductVariant } from '../../product-variants/entities/product-variant.entity';

@Entity({ name: 'inventory' })
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(
    () => ProductVariant,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  variant: ProductVariant;

  @Column({
    type: 'int',
    default: 0,
  })
  quantity: number;

  @Column({
    type: 'int',
    default: 0,
  })
  reservedQuantity: number;
}




/* import { Column, Entity, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ProductVariant } from '../../product-variants/entities/product-variant.entity';

@Entity({ name: 'inventory' })
@Unique(['variant'])
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => ProductVariant, { nullable: false, onDelete: 'CASCADE' })
  variant: ProductVariant;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  reservedQuantity: number;
} */
