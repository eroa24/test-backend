import { ConfigService } from "@nestjs/config";
import { getTypeOrmConfig } from "../typeorm.config";
import { Product } from "../../products/entities/product.entity";
import { ProductImage } from "../../products/entities/product-image.entity";
import { Client } from "../../clients/entities/client.entity";
import { Transaction } from "../../transactions/entities/transaction.entity";
import { TransactionProduct } from "../../transactions/entities/transaction-product.entity";
import { Delivery } from "../../deliveries/entities/delivery.entity";

describe("TypeORM Config", () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      get: jest.fn((key: string) => {
        if (key === "database") {
          return {
            host: "test-host",
            port: 5432,
            username: "test-user",
            password: "test-password",
            database: "test-db",
            ssl: false,
          };
        }
        if (key === "app.nodeEnv") {
          return "development";
        }
        return undefined;
      }),
    } as any;
  });

  it("should return correct development configuration", () => {
    const config = getTypeOrmConfig(configService);

    expect(config).toEqual({
      type: "postgres",
      host: "test-host",
      port: 5432,
      username: "test-user",
      password: "test-password",
      database: "test-db",
      entities: [
        Product,
        ProductImage,
        Client,
        Transaction,
        TransactionProduct,
        Delivery,
      ],
      synchronize: true,
      ssl: false,
    });
  });

  it("should return correct production configuration with SSL", () => {
    configService.get = jest.fn((key: string) => {
      if (key === "database") {
        return {
          host: "test-host",
          port: 5432,
          username: "test-user",
          password: "test-password",
          database: "test-db",
          ssl: true,
        };
      }
      if (key === "app.nodeEnv") {
        return "production";
      }
      return undefined;
    });

    const config = getTypeOrmConfig(configService);

    expect(config).toEqual({
      type: "postgres",
      host: "test-host",
      port: 5432,
      username: "test-user",
      password: "test-password",
      database: "test-db",
      entities: [
        Product,
        ProductImage,
        Client,
        Transaction,
        TransactionProduct,
        Delivery,
      ],
      synchronize: false,
      ssl: { rejectUnauthorized: false },
    });
  });

  it("should include all required entities", () => {
    const config = getTypeOrmConfig(configService);
    expect(config.entities).toContain(Product);
    expect(config.entities).toContain(ProductImage);
    expect(config.entities).toContain(Client);
    expect(config.entities).toContain(Transaction);
    expect(config.entities).toContain(TransactionProduct);
    expect(config.entities).toContain(Delivery);
  });
});
