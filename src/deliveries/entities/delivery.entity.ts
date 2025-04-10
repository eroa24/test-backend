import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Transaction } from "../../transactions/entities/transaction.entity";

export enum DeliveryStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

@Entity("deliveries")
export class Delivery {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Transaction)
  @JoinColumn({ name: "transaction_id" })
  transaction: Transaction;

  @Column({
    type: "enum",
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  @Column({ nullable: true })
  trackingNumber: string;

  @Column({ type: "timestamp", nullable: true })
  estimatedDeliveryDate: Date;

  @Column({ type: "timestamp", nullable: true })
  deliveredDate: Date;

  @Column()
  deliveryAddress: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
