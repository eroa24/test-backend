import { Test } from "@nestjs/testing";
import { DatabaseModule } from "../database.module";

describe("DatabaseModule", () => {
  it("should be defined", async () => {
    const module = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    expect(module).toBeDefined();
  });
});
