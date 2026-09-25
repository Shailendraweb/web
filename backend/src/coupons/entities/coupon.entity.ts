import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'coupons' })
@Index(['code'], { unique: true })
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  amountOff: string;

  @Column({ type: 'int', nullable: true })
  percentOff: number;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
