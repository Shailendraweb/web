import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../user/entities/user.entity';
import { Product, ProductStatus } from '../product/entities/product.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { Wishlist } from '../wishlists/entities/wishlist.entity';
import { Review } from '../reviews/entities/review.entity';
import { Order } from '../orders/entities/order.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Shipment } from '../shipments/entities/shipment.entity';

dotenv.config();

describe('Ecommerce integration (Postgres)', () => {
  let ds: DataSource;

  beforeAll(async () => {
    ds = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'nest',
      synchronize: true,
      dropSchema: true,
      entities: [User, Product, Coupon, Wishlist, Review, Order, Payment, Shipment],
    });
    await ds.initialize();
  }, 20000);

  afterAll(async () => {
    if (ds && ds.isInitialized) await ds.destroy();
  });

  test('create basic ecommerce records', async () => {
    const userRepo = ds.getRepository(User);
    const prodRepo = ds.getRepository(Product);
    const couponRepo = ds.getRepository(Coupon);
    const wishRepo = ds.getRepository(Wishlist);
    const reviewRepo = ds.getRepository(Review);
    const orderRepo = ds.getRepository(Order);
    const paymentRepo = ds.getRepository(Payment);
    const shipmentRepo = ds.getRepository(Shipment);

    const user = userRepo.create({ firstName: 'Test', lastName: 'User', email: 'test@example.com', passwordHash: 'hash' } as any);
    await userRepo.save(user);

    const product = prodRepo.create({ name: 'T-Shirt', slug: 't-shirt', status: ProductStatus.ACTIVE } as any);
    await prodRepo.save(product);

    const coupon = couponRepo.create({ code: 'TEST10', amountOff: '10.00' } as any);
    await couponRepo.save(coupon);

    const wishlist = wishRepo.create({ user, product } as any);
    await wishRepo.save(wishlist);

    const review = reviewRepo.create({ user, product, rating: 5, comment: 'Great' } as any);
    await reviewRepo.save(review);

    const order = orderRepo.create({ user, subtotal: '100.00', tax: '10.00', shipping: '5.00', total: '115.00' } as any);
    await orderRepo.save(order);

    const payment = paymentRepo.create({ order, provider: 'test', transactionId: 'txn_1', amount: '115.00', status: 'completed' } as any);
    await paymentRepo.save(payment);

    const shipment = shipmentRepo.create({ order, carrier: 'UPS', trackingNumber: '1Z', status: 'pending' } as any);
    await shipmentRepo.save(shipment);

    const userCount = await userRepo.count();
    const prodCount = await prodRepo.count();
    const couponCount = await couponRepo.count();

    expect(userCount).toBe(1);
    expect(prodCount).toBe(1);
    expect(couponCount).toBe(1);

    const fetchedOrder = await orderRepo.findOne({ where: { id: order.id }, relations: ['items'] } as any);
    expect(fetchedOrder).toBeTruthy();
  }, 20000);
});
