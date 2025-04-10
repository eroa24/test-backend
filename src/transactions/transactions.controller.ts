import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { Transaction } from "./entities/transaction.entity";

@ApiTags("transactions")
@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Crear una nueva transacción" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Transacción creada exitosamente",
    type: Transaction,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Datos de transacción inválidos o stock insuficiente",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Cliente o producto no encontrado",
  })
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get(":email")
  async getTransaction(@Param("email") email: string) {
    return this.transactionsService.getTransactionByEmail(email);
  }

  @Get("id/:id")
  async getTransactionById(@Param("id") id: string) {
    return this.transactionsService.getTransactionById(id);
  }
}
