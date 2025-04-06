import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { Logger } from "@nestjs/common";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private dataSource: DataSource;
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      this.dataSource = new DataSource(this.getDataSourceOptions());
      await this.dataSource.initialize();
      this.logger.log("Conexión a la base de datos establecida correctamente");
    } catch (error) {
      this.logger.error(
        `Error al conectar a la base de datos: ${error.message}`
      );
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.dataSource) {
      await this.dataSource.destroy();
      this.logger.log("Conexión a la base de datos cerrada correctamente");
    }
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }

  private getDataSourceOptions(): DataSourceOptions {
    const dbConfig = this.configService.get("database");

    return {
      type: "postgres",
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],
      synchronize: this.configService.get("app.nodeEnv") === "development",
      ssl:
        this.configService.get("app.nodeEnv") === "production"
          ? { rejectUnauthorized: false }
          : false,
    };
  }
}
