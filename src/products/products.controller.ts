import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Param,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerResponse,
  ApiParam,
} from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { Product } from "./entities/product.entity";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";

@ApiTags("products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Crear un nuevo producto" })
  @SwaggerResponse({
    status: HttpStatus.CREATED,
    description: "Producto creado exitosamente",
    type: Product,
  })
  @SwaggerResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Datos de producto inválidos",
  })
  @SwaggerResponse({
    status: HttpStatus.CONFLICT,
    description: "Producto ya existe",
  })
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar productos" })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: "Lista de productos  exitosamente",
    type: PaginatedResponseDto,
  })
  async findAll(
    @Query() query: PaginationQueryDto
  ): Promise<PaginatedResponseDto<Product>> {
    return this.productsService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un producto por ID" })
  @ApiParam({
    name: "id",
    description: "ID del producto",
    type: "string",
    format: "uuid",
  })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: "Producto encontrado exitosamente",
    type: Product,
  })
  @SwaggerResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Producto no encontrado",
  })
  async findOne(@Param("id") id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }
}
