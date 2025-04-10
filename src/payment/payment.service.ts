import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import {
  TokenCreationException,
  TermsAndConditionsException,
  PaymentCreationException,
} from "./exceptions/payments.exceptions";
export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethod: {
    type: string;
    token: string;
    installments: number;
  };
  customerEmail: string;
  customerName: string;
  customerMobile: string;
  shippingAddress: {
    addressLine1: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

export interface PaymentResponse {
  id: string;
  created_at: string;
  amount_in_cents: number;
  reference: string;
  customer_email: string;
  currency: string;
  payment_method_type: string;
  payment_method: {
    type: string;
    extra: {
      bin: string;
      name: string;
      brand: string;
      exp_year: string;
      card_type: string;
      exp_month: string;
      last_four: string;
      card_holder: string;
      is_three_ds: boolean;
    };
    installments: number;
  };
  status: string;
  shipping_address: {
    address_line_1: string;
    country: string;
    region: string;
    city: string;
    name: string;
    phone_number: string;
    postal_code: string;
  };
  customer_data: {
    legal_id: string;
    full_name: string;
    phone_number: string;
    legal_id_type: string;
  };
}

export interface TokenCardRequest {
  number: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
  cvc: string;
  termsAccepted: boolean;
  dataProcessingAccepted: boolean;
}

export interface TokenCardResponse {
  token_card: string;
  last_four: string;
  acceptance_token: string;
  accept_personal_auth: string;
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly apiUrl: string;
  private readonly publicKey: string;
  private readonly privateKey: string;
  private readonly integrityKey: string;
  private readonly currency: string;
  constructor(private readonly configService: ConfigService) {
    this.apiUrl = this.configService.get<string>("PAYMENT_API_URL");
    this.publicKey = this.configService.get<string>("PAYMENT_PUBLIC_KEY");
    this.privateKey = this.configService.get<string>("PAYMENT_PRIVATE_KEY");
    this.integrityKey = this.configService.get<string>("PAYMENT_INTEGRITY_KEY");
    this.currency = this.configService.get<string>("CURRENCY");
  }

  async tokenCard(card: TokenCardRequest): Promise<TokenCardResponse> {
    try {
      const { number, card_holder, exp_month, exp_year, cvc } = card;
      const cardNumber = number.replace(/\s/g, "");

      const { accept_personal_auth, acceptance_token } =
        await this.acceptTermsAndConditions(card);
      const response = await axios.post(
        `${this.apiUrl}/tokens/cards`,
        {
          card_holder,
          exp_month,
          exp_year,
          cvc,
          number: cardNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${this.publicKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      return {
        token_card: response.data.data.id,
        last_four: response.data.data.last_four,
        acceptance_token,
        accept_personal_auth,
      };
    } catch (error) {
      throw new TokenCreationException(
        `Error al crear token de tarjeta: ${error.response.data.error}`,
        error.stack
      );
    }
  }

  async acceptTermsAndConditions(card: TokenCardRequest) {
    try {
      const { termsAccepted, dataProcessingAccepted } = card;
      if (!termsAccepted || !dataProcessingAccepted) {
        throw new TermsAndConditionsException(
          "Debe aceptar los términos y condiciones para crear un token de tarjeta"
        );
      }
      const response = await axios.get(
        `${this.apiUrl}/merchants/${this.publicKey}`
      );
      return {
        acceptance_token:
          response.data.data.presigned_acceptance.acceptance_token,
        accept_personal_auth:
          response.data.data.presigned_personal_data_auth.acceptance_token,
      };
    } catch (error) {
      throw new TermsAndConditionsException(
        `Error al aceptar términos y condiciones: ${error.response.data.error}`,
        error.stack
      );
    }
  }

  async createPayment(paymentRequest: CreatePaymentDto) {
    try {
      const { amount_in_cents } = paymentRequest;
      const reference = this.generateReference();
      const hashSignature = await this.hashSignature(
        `${reference}${amount_in_cents}${this.currency}${this.integrityKey}`
      );

      const response = {
        id: "15113-1744237787-28595",
        created_at: "2025-04-09T22:29:49.251Z",
        finalized_at: null,
        amount_in_cents: 1034590,
        reference: "ORD-GJ2C5F",
        customer_email: "camiloroabaron@gmail.com",
        currency: "COP",
        payment_method_type: "CARD",
        payment_method: { type: "CARD", extra: [Object], installments: 1 },
        status: "PENDING",
        status_message: null,
        billing_data: null,
        shipping_address: {
          name: "adsad",
          phone_number: "3154343149",
          address_line_1: "Calle 41 5w 17",
          country: "CO",
          region: "CO",
          city: "Neiva",
          postal_code: "410001",
        },
        redirect_url: null,
        payment_source_id: null,
        payment_link_id: null,
        customer_data: { full_name: "adsad", phone_number: "3154343149" },
        bill_id: null,
        taxes: [],
        tip_in_cents: null,
      };

      //   const response = await axios.post(
      //     `${this.apiUrl}/transactions`,
      //     {
      //       ...paymentRequest,
      //       reference,
      //       signature: hashSignature,
      //     },
      //     {
      //       headers: {
      //         Authorization: `Bearer ${this.privateKey}`,
      //         "Content-Type": "application/json",
      //       },
      //     }
      //   );

      //   this.logger.log(`Pago creado exitosamente con ID: ${response.data.id}`);

      //   return response.data.data;
      return response;
    } catch (error) {
      this.logger.error(
        `Error al crear pago: ${error.response.data.error}`,
        error.stack
      );
      throw new PaymentCreationException(
        `Error al crear pago: ${error.response.data.error}`,
        error.stack
      );
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      this.logger.log(`Consultando estado del pago con ID: ${paymentId}`);

      const response = await axios.get(
        `${this.apiUrl}/transactions/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${this.privateKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      this.logger.log(`Estado del pago obtenido: ${response.data.status}`);

      return response.data;
    } catch (error) {
      this.logger.error(
        `Error al consultar estado del pago: ${error.message}`,
        error.stack
      );

      throw error;
    }
  }

  private async hashSignature(text: string) {
    const encondedText = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encondedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  }

  private generateReference = (prefix = "ORD") => {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${randomPart}`;
  };
}
