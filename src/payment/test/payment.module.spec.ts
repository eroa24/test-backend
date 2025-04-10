import { Test } from "@nestjs/testing";
import { PaymentModule } from "../payment.module";
import { PaymentService } from "../payment.service";
import { ConfigModule } from "@nestjs/config";
import { paymentConfig } from "../../config/app.config";

describe("PaymentModule", () => {
  it("should compile the module", async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [paymentConfig],
        }),
        PaymentModule,
      ],
    }).compile();

    expect(module).toBeDefined();
  });

  it("should provide PaymentService", async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [paymentConfig],
        }),
        PaymentModule,
      ],
    }).compile();

    const service = module.get<PaymentService>(PaymentService);
    expect(service).toBeDefined();
  });
});
