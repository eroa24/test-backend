import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Product } from "../products/entities/product.entity";
import { ProductImage } from "../products/entities/product-image.entity";
import { Client } from "../clients/entities/client.entity";
import { Transaction } from "../transactions/entities/transaction.entity";
import { TransactionProduct } from "../transactions/entities/transaction-product.entity";

export const getTypeOrmConfig = (
  configService: ConfigService
): TypeOrmModuleOptions => {
  const dbConfig = configService.get("database");
  const nodeEnv = configService.get("app.nodeEnv");

  return {
    type: "postgres",
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: [Product, ProductImage, Client, Transaction, TransactionProduct],
    synchronize: nodeEnv === "development",
    ssl: nodeEnv === "production" ? { rejectUnauthorized: false } : false,
  };
};
