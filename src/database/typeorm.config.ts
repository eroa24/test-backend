import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Product } from "../products/entities/product.entity";
import { ProductImage } from "../products/entities/product-image.entity";
import { Client } from "../clients/entities/client.entity";

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
    entities: [Product, ProductImage, Client],
    synchronize: nodeEnv === "development",
    ssl: nodeEnv === "production" ? { rejectUnauthorized: false } : false,
  };
};
