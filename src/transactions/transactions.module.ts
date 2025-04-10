import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { Transaction } from "./entities/transaction.entity";
import { TransactionProduct } from "./entities/transaction-product.entity";
import { ClientsModule } from "../clients/clients.module";
import { ProductsModule } from "../products/products.module";
import { PaymentModule } from "../payment/payment.module";
import { DeliveriesModule } from "../deliveries/deliveries.module";
@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionProduct]),
    ClientsModule,
    ProductsModule,
    PaymentModule,
    DeliveriesModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
