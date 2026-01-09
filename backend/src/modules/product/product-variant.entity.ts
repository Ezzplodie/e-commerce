import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Product } from "./product.entity";

@Entity({ name: "product_variants", schema: "clothes_shop" })
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: "product_id",
    type: "int",
  })
  productId!: number;

  @Column({
    type: "varchar",
    length: 100,
    unique: true,
  })
  sku!: string;

  @Column({
    type: "numeric",
    precision: 10,
    scale: 2,
  })
  price!: number;

  @Column({
    type: "int",
    default: 0,
  })
  stock!: number;

  @Column({
    type: "jsonb",
    nullable: true,
  })
  attributes?: Record<string, any>;

  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({ name: "product_id" })
  product!: Product;
}
