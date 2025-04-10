import { Test } from "@nestjs/testing";
import { ConfigModule } from "../config.module";
import { ConfigService } from "@nestjs/config";

describe("ConfigModule", () => {
  it("should be defined", async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule],
    }).compile();

    expect(module).toBeDefined();
  });

  it("should provide ConfigService", async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule],
    }).compile();

    const configService = module.get<ConfigService>(ConfigService);
    expect(configService).toBeDefined();
  });

  it("should load all configurations", async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule],
    }).compile();

    const configService = module.get<ConfigService>(ConfigService);

    expect(configService.get("database")).toBeDefined();
    expect(configService.get("payment")).toBeDefined();
    expect(configService.get("app")).toBeDefined();
  });
});
