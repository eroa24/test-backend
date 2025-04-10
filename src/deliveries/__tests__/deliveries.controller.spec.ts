import { Test, TestingModule } from "@nestjs/testing";
import { DeliveriesController } from "../deliveries.controller";
import { DeliveriesService } from "../deliveries.service";
import { DeliveryStatus } from "../entities/delivery.entity";

describe("DeliveriesController", () => {
  let controller: DeliveriesController;
  let service: DeliveriesService;

  const mockDeliveriesService = {
    create: jest.fn(),
    getDelivery: jest.fn(),
    updateDeliveryStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveriesController],
      providers: [
        {
          provide: DeliveriesService,
          useValue: mockDeliveriesService,
        },
      ],
    }).compile();

    controller = module.get<DeliveriesController>(DeliveriesController);
    service = module.get<DeliveriesService>(DeliveriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    const createDeliveryDto = {
      transactionId: "123",
      deliveryAddress: "Test Address",
      city: "Test City",
      postalCode: "12345",
      name: "Test Name",
      phone: "1234567890",
    };

    it("should create a delivery", async () => {
      const expectedDelivery = {
        id: "1",
        ...createDeliveryDto,
        status: DeliveryStatus.PENDING,
      };

      mockDeliveriesService.create.mockResolvedValue(expectedDelivery);

      const result = await controller.create(createDeliveryDto);

      expect(result).toEqual(expectedDelivery);
      expect(mockDeliveriesService.create).toHaveBeenCalledWith(
        createDeliveryDto
      );
    });
  });

  describe("getDelivery", () => {
    it("should return a delivery by id", async () => {
      const expectedDelivery = {
        id: "1",
        status: DeliveryStatus.PENDING,
      };

      mockDeliveriesService.getDelivery.mockResolvedValue(expectedDelivery);

      const result = await controller.getDelivery("1");

      expect(result).toEqual(expectedDelivery);
      expect(mockDeliveriesService.getDelivery).toHaveBeenCalledWith("1");
    });
  });

  describe("updateDeliveryStatus", () => {
    const updateStatusDto = {
      status: DeliveryStatus.IN_PROGRESS,
    };

    it("should update delivery status", async () => {
      const expectedDelivery = {
        id: "1",
        status: DeliveryStatus.IN_PROGRESS,
      };

      mockDeliveriesService.updateDeliveryStatus.mockResolvedValue(
        expectedDelivery
      );

      const result = await controller.updateDeliveryStatus(
        "1",
        updateStatusDto
      );

      expect(result).toEqual(expectedDelivery);
      expect(mockDeliveriesService.updateDeliveryStatus).toHaveBeenCalledWith(
        "1",
        updateStatusDto
      );
    });
  });
});
