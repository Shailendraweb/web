import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './user/entities/user.entity';
import { Product } from './product/entities/product.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { Payment } from './payments/entities/payment.entity';
import { Shipment } from './shipments/entities/shipment.entity';
import { Review } from './reviews/entities/review.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { Coupon } from './coupons/entities/coupon.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'nest',
  synchronize: false,
  logging: false,
  entities: [User, Product, Order, OrderItem, Payment, Shipment, Review, Wishlist, Coupon],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
});
