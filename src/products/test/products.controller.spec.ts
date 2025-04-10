import { Test, TestingModule } from "@nestjs/testing";
import { ProductsController } from "../products.controller";
import { ProductsService } from "../products.service";
import { CreateProductDto } from "../dto/create-product.dto";
import { Product } from "../entities/product.entity";
import { PaginatedResponseDto } from "../../common/dto/paginated-response.dto";

describe("ProductsController", () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
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

    const mockProduct: Product = {
      id: "1",
      ...createProductDto,
      images: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("should create a product successfully", async () => {
      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createProductDto);

      expect(result).toEqual(mockProduct);
      expect(mockProductsService.create).toHaveBeenCalledWith(createProductDto);
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

    const mockPaginatedResponse: PaginatedResponseDto<Product> = {
      items: mockProducts,
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    it("should return paginated products", async () => {
      mockProductsService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll({ page: 1, limit: 10 });

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockProductsService.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });
  });

  describe("findOne", () => {
    const mockProduct: Product = {
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
      mockProductsService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne("1");

      expect(result).toEqual(mockProduct);
      expect(mockProductsService.findOne).toHaveBeenCalledWith("1");
    });
  });
});
