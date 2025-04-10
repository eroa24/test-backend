import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Transaction } from "./transaction.entity";
import { Product } from "../../products/entities/product.entity";

@Entity("transaction_products")
export class TransactionProduct {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(
    () => Transaction,
    (transaction) => transaction.transactionProducts
  )
  @JoinColumn({ name: "transaction_id" })
  transaction: Transaction;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({ type: "int" })
  quantity: number;

  @Column({
    type: "int",
    comment: "Precio unitario al momento de la transacción",
  })
  unitPrice: number;
}
