import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEcommerceTables0001 implements MigrationInterface {
  name = 'CreateEcommerceTables0001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "payments" (
        "id" SERIAL PRIMARY KEY,
        "orderId" integer NOT NULL,
        "provider" varchar(50) NOT NULL,
        "transactionId" varchar(255),
        "amount" numeric(12,2) NOT NULL,
        "status" varchar(50) NOT NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "shipments" (
        "id" SERIAL PRIMARY KEY,
        "orderId" integer NOT NULL,
        "carrier" varchar(50) NOT NULL,
        "trackingNumber" varchar(100),
        "status" varchar(50) NOT NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "reviews" (
        "id" SERIAL PRIMARY KEY,
        "userId" integer NOT NULL,
        "productId" integer NOT NULL,
        "rating" integer NOT NULL,
        "comment" text,
        "createdAt" timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "wishlists" (
        "id" SERIAL PRIMARY KEY,
        "userId" integer NOT NULL,
        "productId" integer NOT NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_wishlist_user_product" ON "wishlists" ("userId", "productId");
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "coupons" (
        "id" SERIAL PRIMARY KEY,
        "code" varchar(50) NOT NULL,
        "amountOff" numeric(12,2),
        "percentOff" integer,
        "expiresAt" timestamptz,
        "createdAt" timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_coupons_code" ON "coupons" ("code");
    `);

    // Add foreign keys to orders/users/products where those tables exist
    await queryRunner.query(`
      ALTER TABLE IF EXISTS "payments" ADD CONSTRAINT IF NOT EXISTS "FK_payments_order" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE IF EXISTS "shipments" ADD CONSTRAINT IF NOT EXISTS "FK_shipments_order" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE IF EXISTS "reviews" ADD CONSTRAINT IF NOT EXISTS "FK_reviews_user" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE IF EXISTS "reviews" ADD CONSTRAINT IF NOT EXISTS "FK_reviews_product" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE IF EXISTS "wishlists" ADD CONSTRAINT IF NOT EXISTS "FK_wishlist_user" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE IF EXISTS "wishlists" ADD CONSTRAINT IF NOT EXISTS "FK_wishlist_product" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE IF EXISTS "wishlists" DROP CONSTRAINT IF EXISTS "FK_wishlist_product"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "wishlists" DROP CONSTRAINT IF EXISTS "FK_wishlist_user"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "reviews" DROP CONSTRAINT IF EXISTS "FK_reviews_product"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "reviews" DROP CONSTRAINT IF EXISTS "FK_reviews_user"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "shipments" DROP CONSTRAINT IF EXISTS "FK_shipments_order"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "payments" DROP CONSTRAINT IF EXISTS "FK_payments_order"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "coupons"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_coupons_code"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "wishlists"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_wishlist_user_product"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "reviews"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "shipments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payments"`);
  }
}
