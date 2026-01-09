import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { ProductVariant } from "./product-variant.entity";

@Entity({ name: "products", schema: "clothes_shop" })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: "category_id",
    type: "int",
    nullable: true,
  })
  categoryId?: number;

  @Column({
    type: "varchar",
    length: 255,
  })
  name!: string;

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
  })
  slug!: string;

  @Column({
    type: "text",
    nullable: true,
  })
  description?: string;

  @Column({
    name: "base_price",
    type: "numeric",
    precision: 10,
    scale: 2,
  })
  basePrice!: number;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants!: ProductVariant[];

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp",
  })
  updatedAt!: Date;
}
