import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity({ name: 'products', schema: 'clothes_shop' })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: 'category_id',
    type: 'int',
  })
  category_id!: number;

  @Column({
    type: 'varchar',
  })
  name!: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  slug!: string;

  @Column({
    type: 'text',
  })
  description!: string;

  @Column({
    name: 'base_price',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  base_price!: number;
}
