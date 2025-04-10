import { registerAs } from "@nestjs/config";

export const databaseConfig = registerAs("database", () => ({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "test-back",
  ssl: process.env.DB_SSL === "true",
}));

export const paymentConfig = registerAs("payment", () => ({
  publicKey: process.env.PAYMENT_PUBLIC_KEY,
  privateKey: process.env.PAYMENT_PRIVATE_KEY,
  eventsKey: process.env.PAYMENT_EVENTS_KEY,
  integrityKey: process.env.PAYMENT_INTEGRITY_KEY,
  apiUrl: process.env.PAYMENT_API_URL,
}));

export const appConfig = registerAs("app", () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
}));
