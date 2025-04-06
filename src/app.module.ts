import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule as AppConfigModule } from "./config/config.module";
import { DatabaseModule } from "./database/database.module";
import { ProductsModule } from "./products/products.module";
import { getTypeOrmConfig } from "./database/typeorm.config";

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    DatabaseModule,
    ProductsModule,
  ],
})
export class AppModule {}
