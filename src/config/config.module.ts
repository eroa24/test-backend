import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { databaseConfig, paymentConfig, appConfig } from "./app.config";

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, paymentConfig, appConfig],
      envFilePath: ".env",
    }),
  ],
})
export class ConfigModule {}
