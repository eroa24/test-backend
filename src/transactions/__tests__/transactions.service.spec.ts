import { Test, TestingModule } from "@nestjs/testing";
import { TransactionsService } from "../transactions.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Transaction } from "../entities/transaction.entity";
import { TransactionProduct } from "../entities/transaction-product.entity";
import { ClientsService } from "../../clients/clients.service";
import { ProductsService } from "../../products/products.service";
import { PaymentService } from "../../payment/payment.service";
import { DeliveriesService } from "../../deliveries/deliveries.service";
import {
  TransactionCreationException,
  TransactionNotFoundException,
} from "../exceptions/transaction.exception";

describe("TransactionsService", () => {
  let service: TransactionsService;
  let transactionRepository: any;
  let transactionProductRepository: any;
  let clientsService: any;
  let productsService: any;
  let paymentService: any;
  let deliveriesService: any;

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

  const mockProduct = {
    id: "1",
    name: "Test Product",
    price: 1000,
    stock: 10,
  };

  const mockClient = {
    id: "1",
    email: "test@test.com",
    name: "Test User",
    phone: "1234567890",
    address: "Test Address",
  };

  const mockPaymentResult = {
    id: "pay_123",
    status: "APPROVED",
    last_four: "1234",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn().mockReturnValue(mockTransaction),
            save: jest.fn().mockResolvedValue(mockTransaction),
            find: jest.fn().mockResolvedValue([mockTransaction]),
            findOne: jest.fn().mockResolvedValue(mockTransaction),
          },
        },
        {
          provide: getRepositoryToken(TransactionProduct),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: ClientsService,
          useValue: {
            findByEmail: jest.fn().mockResolvedValue(mockClient),
          },
        },
        {
          provide: ProductsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockProduct),
            updateStock: jest.fn(),
          },
        },
        {
          provide: PaymentService,
          useValue: {
            tokenCard: jest.fn().mockResolvedValue({
              token_card: "token_123",
              last_four: "1234",
              accept_personal_auth: true,
              acceptance_token: "accept_123",
            }),
            createPayment: jest.fn().mockResolvedValue(mockPaymentResult),
          },
        },
        {
          provide: DeliveriesService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionRepository = module.get(getRepositoryToken(Transaction));
    transactionProductRepository = module.get(
      getRepositoryToken(TransactionProduct)
    );
    clientsService = module.get(ClientsService);
    productsService = module.get(ProductsService);
    paymentService = module.get(PaymentService);
    deliveriesService = module.get(DeliveriesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    const createTransactionDto = {
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

    it("should create a transaction successfully", async () => {
      const result = await service.create(createTransactionDto);
      expect(result).toEqual(mockTransaction);
      expect(productsService.findOne).toHaveBeenCalledWith(
        createTransactionDto.productId
      );
      expect(clientsService.findByEmail).toHaveBeenCalled();
      expect(paymentService.tokenCard).toHaveBeenCalled();
      expect(paymentService.createPayment).toHaveBeenCalled();
      expect(productsService.updateStock).toHaveBeenCalled();
      expect(transactionRepository.create).toHaveBeenCalled();
      expect(transactionRepository.save).toHaveBeenCalled();
      expect(transactionProductRepository.create).toHaveBeenCalled();
      expect(transactionProductRepository.save).toHaveBeenCalled();
      expect(deliveriesService.create).toHaveBeenCalled();
    });

    it("should throw TransactionCreationException when product stock is insufficient", async () => {
      jest.spyOn(productsService, "findOne").mockResolvedValueOnce({
        ...mockProduct,
        stock: 0,
      });

      await expect(service.create(createTransactionDto)).rejects.toThrow(
        TransactionCreationException
      );
    });
  });

  describe("getTransactionByEmail", () => {
    it("should return transactions for a valid email", async () => {
      const email = "test@test.com";
      const result = await service.getTransactionByEmail(email);
      expect(result).toEqual([mockTransaction]);
      expect(transactionRepository.find).toHaveBeenCalledWith({
        where: { client: { email } },
        relations: [
          "client",
          "transactionProducts",
          "transactionProducts.product",
          "delivery",
        ],
        order: { createdAt: "DESC" },
      });
    });

    it("should throw TransactionNotFoundException when no transactions are found", async () => {
      jest.spyOn(transactionRepository, "find").mockResolvedValueOnce([]);
      const email = "nonexistent@test.com";

      await expect(service.getTransactionByEmail(email)).rejects.toThrow(
        TransactionNotFoundException
      );
    });
  });

  describe("getTransactionById", () => {
    it("should return a transaction for a valid id", async () => {
      const id = "1";
      const result = await service.getTransactionById(id);
      expect(result).toEqual(mockTransaction);
      expect(transactionRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: [
          "client",
          "transactionProducts",
          "transactionProducts.product",
          "delivery",
        ],
      });
    });

    it("should throw TransactionNotFoundException when transaction is not found", async () => {
      jest.spyOn(transactionRepository, "findOne").mockResolvedValueOnce(null);
      const id = "nonexistent";

      await expect(service.getTransactionById(id)).rejects.toThrow(
        TransactionNotFoundException
      );
    });
  });
});
