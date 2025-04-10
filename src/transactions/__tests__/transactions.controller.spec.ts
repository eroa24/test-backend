import { Test, TestingModule } from "@nestjs/testing";
import { TransactionsController } from "../transactions.controller";
import { TransactionsService } from "../transactions.service";

describe("TransactionsController", () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransaction = {
    id: "1",
    client: { id: "1", email: "test@test.com" },
    total: 1000,
    paymentId: "pay_123",
    status: "APPROVED",
    lastFour: "1234",
    tax: 190,
    createdAt: new Date(),
  };

  const mockCreateTransactionDto = {
    productId: "1",
    quantity: 1,
    deliveryData: {
      email: "test@test.com",
      fullName: "Test User",
      phone: "1234567890",
      address: "Test Address",
      city: "Test City",
      postalCode: "12345",
    },
    amount: {
      subtotal: 810,
      tax: 190,
      shipping: 0,
      total: 1000,
    },
    cardData: {
      cardNumber: "4111111111111111",
      expiryDate: "12/25",
      cvc: "123",
      cardName: "Test User",
      installments: "1",
      termsAccepted: true,
      dataProcessingAccepted: true,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockTransaction),
            getTransactionByEmail: jest
              .fn()
              .mockResolvedValue([mockTransaction]),
            getTransactionById: jest.fn().mockResolvedValue(mockTransaction),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a transaction", async () => {
      const result = await controller.create(mockCreateTransactionDto);
      expect(result).toEqual(mockTransaction);
      expect(service.create).toHaveBeenCalledWith(mockCreateTransactionDto);
    });
  });

  describe("getTransaction", () => {
    it("should return transactions for a valid email", async () => {
      const email = "test@test.com";
      const result = await controller.getTransaction(email);
      expect(result).toEqual([mockTransaction]);
      expect(service.getTransactionByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe("getTransactionById", () => {
    it("should return a transaction for a valid id", async () => {
      const id = "1";
      const result = await controller.getTransactionById(id);
      expect(result).toEqual(mockTransaction);
      expect(service.getTransactionById).toHaveBeenCalledWith(id);
    });
  });
});
