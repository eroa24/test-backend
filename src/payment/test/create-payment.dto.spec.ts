import { validate } from "class-validator";
import { CreatePaymentDto } from "../dto/create-payment.dto";

describe("CreatePaymentDto", () => {
  it("should validate a valid payment DTO", async () => {
    const validDto = new CreatePaymentDto();
    validDto.amount_in_cents = 100000;
    validDto.currency = "COP";
    validDto.payment_method = {
      type: "card",
      token: "tok_123",
      installments: 1,
    };
    validDto.customer_email = "test@example.com";
    validDto.acceptance_token = "accept_123";
    validDto.accept_personal_auth = "auth_123";
    validDto.customer_data = {
      phone_number: "+573001234567",
      full_name: "John Doe",
    };
    validDto.shipping_address = {
      address_line_1: "Test Address",
      city: "Test City",
      region: "Test Region",
      country: "CO",
      name: "John Doe",
      phone_number: "+573001234567",
      postal_code: "12345",
    };

    const errors = await validate(validDto);
    expect(errors.length).toBe(0);
  });

  it("should fail validation with invalid email", async () => {
    const invalidDto = new CreatePaymentDto();
    invalidDto.amount_in_cents = 100000;
    invalidDto.currency = "COP";
    invalidDto.payment_method = {
      type: "card",
      token: "tok_123",
      installments: 1,
    };
    invalidDto.customer_email = "invalid-email";
    invalidDto.acceptance_token = "accept_123";
    invalidDto.accept_personal_auth = "auth_123";
    invalidDto.customer_data = {
      phone_number: "+573001234567",
      full_name: "John Doe",
    };
    invalidDto.shipping_address = {
      address_line_1: "Test Address",
      city: "Test City",
      region: "Test Region",
      country: "CO",
      name: "John Doe",
      phone_number: "+573001234567",
      postal_code: "12345",
    };

    const errors = await validate(invalidDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe("customer_email");
  });

  it("should fail validation with missing required fields", async () => {
    const invalidDto = new CreatePaymentDto();
    // No establecemos ningún campo

    const errors = await validate(invalidDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("should fail validation with invalid amount", async () => {
    const invalidDto = new CreatePaymentDto();
    invalidDto.amount_in_cents = 0; // Monto inválido (debe ser mayor que 0)
    invalidDto.currency = "COP";
    invalidDto.payment_method = {
      type: "card",
      token: "tok_123",
      installments: 1,
    };
    invalidDto.customer_email = "test@example.com";
    invalidDto.acceptance_token = "accept_123";
    invalidDto.accept_personal_auth = "auth_123";
    invalidDto.customer_data = {
      phone_number: "+573001234567",
      full_name: "John Doe",
    };
    invalidDto.shipping_address = {
      address_line_1: "Test Address",
      city: "Test City",
      region: "Test Region",
      country: "CO",
      name: "John Doe",
      phone_number: "+573001234567",
      postal_code: "12345",
    };

    const errors = await validate(invalidDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe("amount_in_cents");
  });
});
