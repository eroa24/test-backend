import { Test, TestingModule } from "@nestjs/testing";
import { ProductsService } from "../products.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Product } from "../entities/product.entity";
import { ProductImage } from "../entities/product-image.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "../dto/create-product.dto";
import { UpdateStockDto } from "../dto/update-stock.dto";
import {
  ProductNotFoundException,
  ProductDuplicateException,
  ProductInsufficientStockException,
} from "../exceptions/product.exception";

describe("ProductsService", () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;
  let productImageRepository: Repository<ProductImage>;

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  const mockProductImageRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(ProductImage),
          useValue: mockProductImageRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product)
    );
    productImageRepository = module.get<Repository<ProductImage>>(
      getRepositoryToken(ProductImage)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    const createProductDto: CreateProductDto = {
      name: "Test Product",
      description: "Test Description",
      price: 1000,
      stock: 10,
      images: [
        {
          url: "http://example.com/image.jpg",
          alt: "Test Image",
          order: 1,
        },
      ],
    };

    const mockProduct = {
      id: "1",
      ...createProductDto,
      images: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("should create a product successfully", async () => {
      mockProductRepository.findOne.mockResolvedValueOnce(null);
      mockProductRepository.create.mockReturnValue(mockProduct);
      mockProductRepository.save.mockResolvedValueOnce(mockProduct);
      mockProductRepository.findOne.mockResolvedValueOnce(mockProduct);

      const result = await service.create(createProductDto);

      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.create).toHaveBeenCalledWith({
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,
      });
      expect(mockProductRepository.save).toHaveBeenCalled();
    });

    it("should throw ProductDuplicateException when product name already exists", async () => {
      mockProductRepository.findOne.mockResolvedValueOnce(mockProduct);

      await expect(service.create(createProductDto)).rejects.toThrow(
        ProductDuplicateException
      );
    });
  });

  describe("findAll", () => {
    const mockProducts = [
      {
        id: "1",
        name: "Product 1",
        description: "Description 1",
        price: 1000,
        stock: 10,
        images: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it("should return paginated products", async () => {
      mockProductRepository.findAndCount.mockResolvedValue([mockProducts, 1]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toEqual({
        items: mockProducts,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe("findOne", () => {
    const mockProduct = {
      id: "1",
      name: "Test Product",
      description: "Test Description",
      price: 1000,
      stock: 10,
      images: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("should return a product by id", async () => {
      mockProductRepository.findOne.mockResolvedValueOnce(mockProduct);

      const result = await service.findOne("1");

      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
        relations: ["images"],
      });
    });

    it("should throw ProductNotFoundException when product not found", async () => {
      mockProductRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne("1")).rejects.toThrow(
        ProductNotFoundException
      );
    });
  });

  describe("updateStock", () => {
    const mockProduct = {
      id: "1",
      name: "Test Product",
      description: "Test Description",
      price: 1000,
      stock: 10,
      images: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updateStockDto: UpdateStockDto = {
      quantity: 5,
    };

    it("should update stock successfully", async () => {
      mockProductRepository.findOne.mockResolvedValueOnce(mockProduct);
      mockProductRepository.save.mockResolvedValueOnce({
        ...mockProduct,
        stock: 15,
      });

      const result = await service.updateStock("1", updateStockDto);

      expect(result.stock).toBe(15);
      expect(mockProductRepository.save).toHaveBeenCalled();
    });

    it("should throw ProductInsufficientStockException when trying to reduce more than available stock", async () => {
      mockProductRepository.findOne.mockResolvedValueOnce(mockProduct);
      mockProductRepository.save.mockRejectedValueOnce(
        new ProductInsufficientStockException("1", 15, 10)
      );

      const negativeUpdateStockDto: UpdateStockDto = {
        quantity: -15,
      };

      await expect(
        service.updateStock("1", negativeUpdateStockDto)
      ).rejects.toThrow(ProductInsufficientStockException);
    });

    it("should throw ProductNotFoundException when product not found", async () => {
      mockProductRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.updateStock("1", updateStockDto)).rejects.toThrow(
        ProductNotFoundException
      );
    });
  });
});
