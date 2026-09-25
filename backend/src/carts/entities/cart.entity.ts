import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CartItem } from './cart-item.entity';

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @OneToMany(() => CartItem, (i) => i.cart, { cascade: true })
  items: CartItem[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
