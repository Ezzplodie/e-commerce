import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity({ name: 'categories', schema: 'clothes_shop' })
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;


  @Column({
    type: 'varchar',
  })
  name!: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  slug!: string;

}
