import { databaseConfig, paymentConfig, appConfig } from "../app.config";

describe("App Config", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.NODE_ENV = "development";
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("databaseConfig", () => {
    it("should return default values when env variables are not set", () => {
      const config = databaseConfig();
      expect(config).toEqual({
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "postgres",
        database: "test-back",
        ssl: false,
      });
    });

    it("should return env values when set", () => {
      process.env.DB_HOST = "test-host";
      process.env.DB_PORT = "5433";
      process.env.DB_USERNAME = "test-user";
      process.env.DB_PASSWORD = "test-password";
      process.env.DB_DATABASE = "test-db";
      process.env.DB_SSL = "true";

      const config = databaseConfig();
      expect(config).toEqual({
        host: "test-host",
        port: 5433,
        username: "test-user",
        password: "test-password",
        database: "test-db",
        ssl: true,
      });
    });
  });

  describe("paymentConfig", () => {
    it("should return undefined values when env variables are not set", () => {
      const config = paymentConfig();
      expect(config).toEqual({
        publicKey: undefined,
        privateKey: undefined,
        eventsKey: undefined,
        integrityKey: undefined,
        apiUrl: undefined,
      });
    });

    it("should return env values when set", () => {
      process.env.PAYMENT_PUBLIC_KEY = "public-key";
      process.env.PAYMENT_PRIVATE_KEY = "private-key";
      process.env.PAYMENT_EVENTS_KEY = "events-key";
      process.env.PAYMENT_INTEGRITY_KEY = "integrity-key";
      process.env.PAYMENT_API_URL = "api-url";

      const config = paymentConfig();
      expect(config).toEqual({
        publicKey: "public-key",
        privateKey: "private-key",
        eventsKey: "events-key",
        integrityKey: "integrity-key",
        apiUrl: "api-url",
      });
    });
  });

  describe("appConfig", () => {
    it("should return default values when env variables are not set", () => {
      const config = appConfig();
      expect(config).toEqual({
        port: 3000,
        nodeEnv: "development",
      });
    });

    it("should return env values when set", () => {
      process.env.PORT = "4000";
      process.env.NODE_ENV = "production";

      const config = appConfig();
      expect(config).toEqual({
        port: 4000,
        nodeEnv: "production",
      });
    });
  });
});
