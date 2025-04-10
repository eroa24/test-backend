import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction } from "./entities/transaction.entity";
import { TransactionProduct } from "./entities/transaction-product.entity";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { ClientsService } from "../clients/clients.service";
import { ProductsService } from "../products/products.service";
import {
  TransactionCreationException,
  TransactionNotFoundException,
} from "./exceptions/transaction.exception";
import { PaymentService } from "../payment/payment.service";
import { DeliveriesService } from "../deliveries/deliveries.service";

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
    private readonly paymentService: PaymentService,
    private readonly deliveriesService: DeliveriesService
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto
  ): Promise<Transaction> {
    try {
      const { productId, quantity, deliveryData, amount, cardData } =
        createTransactionDto;

      await this.validateProductStock(productId, quantity);

      const product = await this.productsService.findOne(productId);
      const client = await this.createOrFindClient(deliveryData);
      const paymentResult = await this.processPayment(
        amount,
        cardData,
        deliveryData
      );

      await this.productsService.updateStock(productId, {
        quantity: -quantity,
      });

      const transaction = await this.createTransactionRecord(
        client,
        product,
        quantity,
        paymentResult,
        amount
      );
      await this.createTransactionProduct(transaction, product, quantity);
      await this.createDelivery(transaction.id, deliveryData);

      return transaction;
    } catch (error) {
      this.handleTransactionError(error);
    }
  }

  private async validateProductStock(
    productId: string,
    quantity: number
  ): Promise<void> {
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
  }

  private async createOrFindClient(deliveryData: any) {
    const { email, fullName, phone, address } = deliveryData;
    return await this.clientsService.findByEmail({
      email,
      name: fullName,
      phone,
      address,
    });
  }

  private async processPayment(amount: any, cardData: any, deliveryData: any) {
    const { total } = amount;
    const { email, fullName, phone, address, city, postalCode } = deliveryData;
    const {
      cardNumber,
      expiryDate,
      cvc,
      cardName,
      installments,
      termsAccepted,
      dataProcessingAccepted,
    } = cardData;

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

    return await this.paymentService.createPayment({
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
  }

  private async createTransactionRecord(
    client: any,
    product: any,
    quantity: number,
    paymentResult: any,
    amount: any
  ): Promise<Transaction> {
    const { total, tax } = amount;
    const { id, status, last_four } = paymentResult;

    const transaction = this.transactionRepository.create({
      client,
      total,
      paymentId: id,
      status,
      lastFour: last_four,
      tax,
    });

    return await this.transactionRepository.save(transaction);
  }

  private async createTransactionProduct(
    transaction: Transaction,
    product: any,
    quantity: number
  ): Promise<void> {
    const transactionProduct = this.transactionProductRepository.create({
      transaction,
      product,
      quantity: Number(quantity),
      unitPrice: Number(product.price),
    });

    await this.transactionProductRepository.save(transactionProduct);
  }

  private async createDelivery(
    transactionId: string,
    deliveryData: any
  ): Promise<void> {
    const { address, city, postalCode, fullName, phone } = deliveryData;
    await this.deliveriesService.create({
      transactionId,
      deliveryAddress: address,
      city,
      postalCode,
      name: fullName,
      phone,
    });
  }

  private handleTransactionError(error: any): never {
    this.logger.error(
      `Error al crear transacción: ${error.message}`,
      error.stack
    );
    if (error.response?.status) {
      throw error;
    }
    throw new TransactionCreationException("Error al crear la transacción", {
      originalError: error.message,
    });
  }

  async getTransactionByEmail(email: string) {
    try {
      const transactions = await this.findTransactionsByEmail(email);

      if (!transactions || transactions.length === 0) {
        throw new TransactionNotFoundException(
          `No se encontraron transacciones para el email: ${email}`
        );
      }

      return transactions;
    } catch (error) {
      this.handleTransactionSearchError(error, email);
    }
  }

  private async findTransactionsByEmail(email: string) {
    return await this.transactionRepository.find({
      where: { client: { email } },
      relations: [
        "client",
        "transactionProducts",
        "transactionProducts.product",
        "delivery",
      ],
      order: { createdAt: "DESC" },
    });
  }

  async getTransactionById(id: string) {
    try {
      this.logger.debug(`Buscando transacción con ID: ${id}`);
      const transaction = await this.transactionRepository.findOne({
        where: { id },
        relations: [
          "client",
          "transactionProducts",
          "transactionProducts.product",
          "delivery",
        ],
      });

      if (!transaction) {
        throw new TransactionNotFoundException(
          `Transacción con ID ${id} no encontrada`
        );
      }

      return transaction;
    } catch (error) {
      this.handleTransactionSearchError(error, id);
    }
  }

  private handleTransactionSearchError(error: any, identifier: string): never {
    if (error instanceof TransactionNotFoundException) {
      throw error;
    }
    throw new TransactionNotFoundException(
      `Error al buscar transacción con identificador: ${identifier}`
    );
  }
}
