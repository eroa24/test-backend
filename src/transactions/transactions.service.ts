import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction } from "./entities/transaction.entity";
import { TransactionProduct } from "./entities/transaction-product.entity";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { ClientsService } from "../clients/clients.service";
import { ProductsService } from "../products/products.service";
import { TransactionCreationException } from "./exceptions/transaction.exception";
import { PaymentService } from "../payment/payment.service";

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionProduct)
    private readonly transactionProductRepository: Repository<TransactionProduct>,
    private readonly clientsService: ClientsService,
    private readonly productsService: ProductsService,
    private readonly paymentService: PaymentService
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto
  ): Promise<Transaction> {
    try {
      const { productId, quantity, deliveryData, amount, cardData } =
        createTransactionDto;
      const { total, subtotal, tax } = amount;
      const { email, fullName, phone, address, city, postalCode } =
        deliveryData;
      const {
        cardNumber,
        expiryDate,
        cvc,
        cardName,
        installments,
        termsAccepted,
        dataProcessingAccepted,
      } = cardData;

      const product = await this.productsService.findOne(productId);

      if (product.stock < quantity) {
        throw new TransactionCreationException(
          `Stock insuficiente para el producto ${product.name}. Cantidad solicitada: ${quantity}, Stock disponible: ${product.stock}`,
          {
            productId: product.id,
            requestedQuantity: quantity,
            availableStock: product.stock,
          }
        );
      }

      const client = await this.clientsService.findByEmail({
        email,
        name: fullName,
        phone,
        address,
      });

      const { token_card, last_four, accept_personal_auth, acceptance_token } =
        await this.paymentService.tokenCard({
          number: cardNumber,
          exp_month: expiryDate.split("/")[0],
          exp_year: expiryDate.split("/")[1],
          cvc,
          card_holder: cardName,
          termsAccepted,
          dataProcessingAccepted,
        });

      const { id, status } = await this.paymentService.createPayment({
        acceptance_token,
        accept_personal_auth,
        amount_in_cents: total,
        currency: "COP",
        customer_email: email,
        payment_method: {
          type: "CARD",
          token: token_card,
          installments: Number(installments),
        },
        customer_data: {
          phone_number: phone,
          full_name: fullName,
        },
        shipping_address: {
          name: fullName,
          phone_number: phone,
          address_line_1: address,
          country: "CO",
          region: "CO",
          city,
          postal_code: postalCode,
        },
      });

      await this.productsService.updateStock(productId, {
        quantity: -quantity,
      });

      const transaction = this.transactionRepository.create({
        client,
        total,
        paymentId: id,
        status,
        lastFour: last_four,
        tax,
        transactionProducts: [
          {
            product,
            quantity: Number(quantity),
            unitPrice: Number(product.price),
          },
        ],
      });
      const savedTransaction = await this.transactionRepository.save(
        transaction
      );
      return savedTransaction;
    } catch (error) {
      this.logger.error(
        `Error al crear transacción: ${error.message}`,
        error.stack
      );
      if (error.response.status) {
        throw error;
      }
      throw new TransactionCreationException("Error al crear la transacción", {
        originalError: error.message,
      });
    }
  }

  async getTransaction(id: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    return transaction;
  }
}
