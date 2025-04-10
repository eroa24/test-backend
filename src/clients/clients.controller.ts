import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { Client } from "./entities/client.entity";

@ApiTags("clients")
@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Crear un nuevo cliente" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Cliente creado exitosamente",
    type: Client,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Datos de cliente inválidos",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Ya existe un cliente con el mismo email",
  })
  async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientsService.findByEmail(createClientDto);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Obtener un cliente por ID" })
  @ApiParam({
    name: "id",
    description: "ID del cliente a obtener",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Cliente encontrado",
    type: Client,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Cliente no encontrado",
  })
  async findOne(@Param("id") id: string): Promise<Client> {
    return this.clientsService.findOne(id);
  }
}
