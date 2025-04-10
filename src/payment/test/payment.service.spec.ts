import { Test, TestingModule } from "@nestjs/testing";
import { PaymentService } from "../payment.service";
import { ConfigService } from "@nestjs/config";
import {
  TokenCreationException,
  TermsAndConditionsException,
  PaymentCreationException,
} from "../exceptions/payments.exceptions";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PaymentService", () => {
  let service: PaymentService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        PAYMENT_API_URL: "https://api.test.com",
        PAYMENT_PUBLIC_KEY: "public_key",
        PAYMENT_PRIVATE_KEY: "private_key",
        PAYMENT_INTEGRITY_KEY: "integrity_key",
        CURRENCY: "COP",
      };
      return config[key];
    }),
  };

  const mockTokenCardRequest = {
    number: "4111 1111 1111 1111",
    exp_month: "12",
    exp_year: "2025",
    card_holder: "John Doe",
    cvc: "123",
    termsAccepted: true,
    dataProcessingAccepted: true,
  };

  const mockTokenCardResponse = {
    token_card: "tok_123",
    last_four: "1111",
    acceptance_token: "accept_123",
    accept_personal_auth: "auth_123",
  };

  const mockCreatePaymentDto = {
    amount_in_cents: 100000,
    currency: "COP",
    payment_method: {
      type: "card",
      token: "tok_123",
      installments: 1,
    },
    customer_email: "test@example.com",
    acceptance_token: "accept_123",
    accept_personal_auth: "auth_123",
    customer_data: {
      phone_number: "+573001234567",
      full_name: "John Doe",
    },
    shipping_address: {
      address_line_1: "Test Address",
      city: "Test City",
      region: "Test Region",
      country: "CO",
      name: "John Doe",
      phone_number: "+573001234567",
      postal_code: "12345",
    },
  };

  const mockPaymentResponse = {
    id: "pay_123",
    created_at: "2024-04-10T00:00:00Z",
    amount_in_cents: 100000,
    reference: "ORD-ABC123",
    customer_email: "test@example.com",
    currency: "COP",
    payment_method_type: "card",
    payment_method: {
      type: "card",
      extra: {
        bin: "411111",
        name: "VISA",
        brand: "VISA",
        exp_year: "2025",
        card_type: "credit",
        exp_month: "12",
        last_four: "1111",
        card_holder: "John Doe",
        is_three_ds: false,
      },
      installments: 1,
    },
    status: "approved",
    shipping_address: {
      address_line_1: "Test Address",
      country: "CO",
      region: "Test Region",
      city: "Test City",
      name: "John Doe",
      phone_number: "+573001234567",
      postal_code: "12345",
    },
    customer_data: {
      legal_id: "123456789",
      full_name: "John Doe",
      phone_number: "+573001234567",
      legal_id_type: "CC",
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("tokenCard", () => {
    it("should create a token card successfully", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: {
            presigned_acceptance: { acceptance_token: "accept_123" },
            presigned_personal_data_auth: { acceptance_token: "auth_123" },
          },
        },
      });

      mockedAxios.post.mockResolvedValueOnce({
        data: {
          data: {
            id: "tok_123",
            last_four: "1111",
          },
        },
      });

      const result = await service.tokenCard(mockTokenCardRequest);

      expect(result).toEqual(mockTokenCardResponse);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://api.test.com/merchants/public_key",
        {
          headers: {
            Authorization: "Bearer public_key",
            "Content-Type": "application/json",
          },
        }
      );
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://api.test.com/tokens/cards",
        {
          card_holder: "John Doe",
          exp_month: "12",
          exp_year: "2025",
          cvc: "123",
          number: "4111111111111111",
        },
        {
          headers: {
            Authorization: "Bearer public_key",
            "Content-Type": "application/json",
          },
        }
      );
    });

    it("should throw TokenCreationException when token creation fails", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: {
            presigned_acceptance: { acceptance_token: "accept_123" },
            presigned_personal_data_auth: { acceptance_token: "auth_123" },
          },
        },
      });

      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: {
            error: "Invalid card data",
          },
        },
      });

      await expect(service.tokenCard(mockTokenCardRequest)).rejects.toThrow(
        TokenCreationException
      );
    });
  });

  describe("acceptTermsAndConditions", () => {
    it("should accept terms and conditions successfully", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: {
            presigned_acceptance: { acceptance_token: "accept_123" },
            presigned_personal_data_auth: { acceptance_token: "auth_123" },
          },
        },
      });

      const result = await service.acceptTermsAndConditions(
        mockTokenCardRequest
      );

      expect(result).toEqual({
        acceptance_token: "accept_123",
        accept_personal_auth: "auth_123",
      });
    });

    it("should throw TermsAndConditionsException when terms are not accepted", async () => {
      const invalidRequest = {
        ...mockTokenCardRequest,
        termsAccepted: false,
        dataProcessingAccepted: false,
      };

      await expect(
        service.acceptTermsAndConditions(invalidRequest)
      ).rejects.toThrow(
        new TermsAndConditionsException(
          "Debe aceptar los términos y condiciones para crear un token de tarjeta"
        )
      );
    });

    it("should throw TermsAndConditionsException when API call fails", async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          data: {
            error: "API Error",
          },
        },
      });

      await expect(
        service.acceptTermsAndConditions(mockTokenCardRequest)
      ).rejects.toThrow(TermsAndConditionsException);
    });
  });

  describe("createPayment", () => {
    it("should create a payment successfully", async () => {
      const mockPaymentResponse = {
        id: "pay_123",
        created_at: "2024-04-10T00:00:00Z",
        amount_in_cents: 100000,
        reference: expect.any(String),
        status: "approved",
      };

      mockedAxios.post.mockResolvedValueOnce({
        data: {
          data: mockPaymentResponse,
        },
      });

      const result = await service.createPayment(mockCreatePaymentDto);

      expect(result).toEqual(mockPaymentResponse);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://api.test.com/transactions",
        expect.objectContaining({
          ...mockCreatePaymentDto,
          reference: expect.any(String),
          signature: expect.any(String),
        }),
        {
          headers: {
            Authorization: "Bearer private_key",
            "Content-Type": "application/json",
          },
        }
      );
    });

    it("should throw PaymentCreationException when payment creation fails", async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: {
            error: "Payment failed",
          },
        },
      });

      await expect(service.createPayment(mockCreatePaymentDto)).rejects.toThrow(
        PaymentCreationException
      );
    });
  });

  describe("getPaymentStatus", () => {
    it("should get payment status successfully", async () => {
      const mockResponse = {
        data: {
          status: "approved",
          id: "pay_123",
        },
      };

      jest.spyOn(axios, "get").mockResolvedValueOnce(mockResponse);

      const result = await service.getPaymentStatus("pay_123");

      expect(result).toEqual(mockResponse.data);
      expect(axios.get).toHaveBeenCalledWith(
        `${service["apiUrl"]}/transactions/pay_123`,
        {
          headers: {
            Authorization: `Bearer ${service["privateKey"]}`,
            "Content-Type": "application/json",
          },
        }
      );
    });

    it("should handle error when getting payment status fails", async () => {
      const mockError = new Error("Error al consultar estado del pago");
      jest.spyOn(axios, "get").mockRejectedValueOnce(mockError);

      await expect(service.getPaymentStatus("pay_123")).rejects.toThrow(
        "Error al consultar estado del pago"
      );
    });
  });
});
