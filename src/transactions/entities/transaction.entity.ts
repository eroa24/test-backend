import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Client } from "../../clients/entities/client.entity";
import { TransactionProduct } from "./transaction-product.entity";
import { Delivery } from "../../deliveries/entities/delivery.entity";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Client, (client) => client.transactions)
  @JoinColumn({ name: "client_id" })
  client: Client;

  @Column({
    type: "int",
  })
  total: number;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ nullable: true })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  lastFour: string;

  @Column({ nullable: true })
  tax: number;

  @OneToMany(
    () => TransactionProduct,
    (transactionProduct) => transactionProduct.transaction
  )
  transactionProducts: TransactionProduct[];

  @OneToOne(() => Delivery, (delivery) => delivery.transaction)
  delivery: Delivery;
}
