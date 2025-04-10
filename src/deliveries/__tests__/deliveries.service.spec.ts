import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DeliveriesService } from "../deliveries.service";
import { Delivery, DeliveryStatus } from "../entities/delivery.entity";
import {
  DeliveryNotFoundException,
  DeliveryStatusUpdateException,
} from "../exceptions/deliveries.exception";

describe("DeliveriesService", () => {
  let service: DeliveriesService;
  let repository: Repository<Delivery>;

  const mockDeliveryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveriesService,
        {
          provide: getRepositoryToken(Delivery),
          useValue: mockDeliveryRepository,
        },
      ],
    }).compile();

    service = module.get<DeliveriesService>(DeliveriesService);
    repository = module.get<Repository<Delivery>>(getRepositoryToken(Delivery));
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

    it("should create a delivery successfully", async () => {
      const { transactionId, ...deliveryDataWithoutTransaction } =
        createDeliveryDto;
      const deliveryData = {
        ...deliveryDataWithoutTransaction,
        transaction: { id: transactionId },
        status: DeliveryStatus.PENDING,
        trackingNumber: expect.any(String),
        deliveredDate: null,
        estimatedDeliveryDate: expect.any(Date),
      };

      const mockDelivery = {
        id: "1",
        ...deliveryData,
      };

      mockDeliveryRepository.create.mockReturnValue(mockDelivery);
      mockDeliveryRepository.save.mockResolvedValue(mockDelivery);

      const result = await service.create(createDeliveryDto);

      expect(result).toEqual(mockDelivery);
      expect(mockDeliveryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining(deliveryData)
      );
      expect(mockDeliveryRepository.save).toHaveBeenCalledWith(mockDelivery);
    });
  });

  describe("getDelivery", () => {
    it("should return a delivery when it exists", async () => {
      const mockDelivery = {
        id: "1",
        status: DeliveryStatus.PENDING,
      };

      mockDeliveryRepository.findOne.mockResolvedValue(mockDelivery);

      const result = await service.getDelivery("1");

      expect(result).toEqual(mockDelivery);
      expect(mockDeliveryRepository.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should throw DeliveryNotFoundException when delivery does not exist", async () => {
      mockDeliveryRepository.findOne.mockResolvedValue(null);

      await expect(service.getDelivery("1")).rejects.toThrow(
        DeliveryNotFoundException
      );
    });
  });

  describe("updateDeliveryStatus", () => {
    const mockDelivery = {
      id: "1",
      status: DeliveryStatus.PENDING,
      deliveredDate: null,
    };

    it("should update delivery status successfully", async () => {
      const updatedDelivery = {
        ...mockDelivery,
        status: DeliveryStatus.IN_PROGRESS,
      };

      mockDeliveryRepository.findOne.mockResolvedValue(mockDelivery);
      mockDeliveryRepository.save.mockResolvedValue(updatedDelivery);

      const result = await service.updateDeliveryStatus("1", {
        status: DeliveryStatus.IN_PROGRESS,
      });

      expect(result.status).toBe(DeliveryStatus.IN_PROGRESS);
      expect(mockDeliveryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockDelivery,
          status: DeliveryStatus.IN_PROGRESS,
        })
      );
    });

    it("should set deliveredDate when status is DELIVERED", async () => {
      const updatedDelivery = {
        ...mockDelivery,
        status: DeliveryStatus.DELIVERED,
        deliveredDate: new Date(),
      };

      mockDeliveryRepository.findOne.mockResolvedValue(mockDelivery);
      mockDeliveryRepository.save.mockResolvedValue(updatedDelivery);

      const result = await service.updateDeliveryStatus("1", {
        status: DeliveryStatus.DELIVERED,
      });

      expect(result.status).toBe(DeliveryStatus.DELIVERED);
      expect(result.deliveredDate).toBeDefined();
      expect(mockDeliveryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockDelivery,
          status: DeliveryStatus.DELIVERED,
          deliveredDate: expect.any(Date),
        })
      );
    });

    it("should throw DeliveryStatusUpdateException when delivery is already delivered", async () => {
      const deliveredDelivery = {
        ...mockDelivery,
        status: DeliveryStatus.DELIVERED,
      };

      mockDeliveryRepository.findOne.mockResolvedValue(deliveredDelivery);

      await expect(
        service.updateDeliveryStatus("1", {
          status: DeliveryStatus.IN_PROGRESS,
        })
      ).rejects.toThrow(DeliveryStatusUpdateException);
    });

    it("should propagate DeliveryNotFoundException when delivery is not found", async () => {
      mockDeliveryRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateDeliveryStatus("1", {
          status: DeliveryStatus.IN_PROGRESS,
        })
      ).rejects.toThrow(DeliveryNotFoundException);
    });
  });
});
