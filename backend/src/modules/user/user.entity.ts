import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'users', schema: 'clothes_shop' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    select: false, // 🔐 never return password
  })
  passwordHash!: string;

  @Column({
    type: 'varchar',
    default: 'customer',
  })
  role!: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  profile?: Record<string, any>;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt!: Date;
}
