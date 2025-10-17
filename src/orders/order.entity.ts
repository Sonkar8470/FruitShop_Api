import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  items: { productId: number; quantity: number }[];

  @Column()
  customerName: string;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
