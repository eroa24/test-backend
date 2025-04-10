import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import { Product } from "./entities/product.entity";
import { ProductImage } from "./entities/product-image.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateStockDto } from "./dto/update-stock.dto";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import {
  ProductCreationException,
  ProductValidationException,
  ProductDuplicateException,
  ProductNotFoundException,
  ProductInsufficientStockException,
} from "./exceptions/product.exception";

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const existingProduct = await this.productRepository.findOne({
        where: { name: createProductDto.name },
      });

      if (existingProduct) {
        throw new ProductDuplicateException(createProductDto.name);
      }

      const product = this.productRepository.create({
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,
      });

      const savedProduct = await this.productRepository.save(product);

      if (createProductDto.images && createProductDto.images.length > 0) {
        const productImages = createProductDto.images.map((imageDto) =>
          this.productImageRepository.create({
            ...imageDto,
            product: savedProduct,
          })
        );

        await this.productImageRepository.save(productImages);
      }

      return await this.productRepository.findOne({
        where: { id: savedProduct.id },
        relations: ["images"],
      });
    } catch (error) {
      this.logger.error(
        `Error al crear producto: ${error.message}`,
        error.stack
      );

      if (
        error instanceof ProductCreationException ||
        error instanceof ProductValidationException ||
        error instanceof ProductDuplicateException
      ) {
        throw error;
      }

      throw new ProductCreationException("Error al crear el producto", {
        originalError: error.message,
      });
    }
  }

  async findAll(
    query: PaginationQueryDto
  ): Promise<PaginatedResponseDto<Product>> {
    try {
      const { page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      const [items, total] = await this.productRepository.findAndCount({
        skip,
        take: limit,
        relations: ["images"],
        where: {
          stock: MoreThan(0),
          isActive: true,
        },
        order: {
          createdAt: "DESC",
        },
      });

      const totalPages = Math.ceil(total / limit);

      return {
        items,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.logger.error(
        `Error al listar productos: ${error.message}`,
        error.stack
      );
      throw new ProductCreationException("Error al listar los productos", {
        originalError: error.message,
      });
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ["images"],
      });

      if (!product) {
        throw new ProductNotFoundException(id);
      }

      return product;
    } catch (error) {
      this.logger.error(
        `Error al obtener producto: ${error.message}`,
        error.stack
      );

      if (error instanceof ProductNotFoundException) {
        throw error;
      }

      throw new ProductCreationException("Error al obtener el producto", {
        originalError: error.message,
      });
    }
  }

  async updateStock(id: string, updateStockDto: UpdateStockDto) {
    const product = await this.findOne(id);
    const updatedStock = product.stock + updateStockDto.quantity;

    if (updatedStock < 0) {
      throw new ProductInsufficientStockException(
        id,
        Math.abs(updateStockDto.quantity),
        product.stock
      );
    }

    product.stock = updatedStock;
    return await this.productRepository.save(product);
  }
}
