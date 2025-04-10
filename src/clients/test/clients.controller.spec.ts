import { Test, TestingModule } from "@nestjs/testing";
import { ClientsController } from "../clients.controller";
import { ClientsService } from "../clients.service";
import { CreateClientDto } from "../dto/create-client.dto";
import { Client } from "../entities/client.entity";

describe("ClientsController", () => {
  let controller: ClientsController;
  let service: ClientsService;

  const mockClient: Client = {
    id: "1",
    name: "Test Client",
    email: "test@example.com",
    phone: "+573001234567",
    address: "Test Address",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    transactions: [],
  };

  const mockCreateClientDto: CreateClientDto = {
    name: "Test Client",
    email: "test@example.com",
    phone: "+573001234567",
    address: "Test Address",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a new client", async () => {
      jest.spyOn(service, "findByEmail").mockResolvedValue(mockClient);

      const result = await controller.create(mockCreateClientDto);

      expect(result).toEqual(mockClient);
      expect(service.findByEmail).toHaveBeenCalledWith(mockCreateClientDto);
    });
  });

  describe("findOne", () => {
    it("should return a client by id", async () => {
      jest.spyOn(service, "findOne").mockResolvedValue(mockClient);

      const result = await controller.findOne("1");

      expect(result).toEqual(mockClient);
      expect(service.findOne).toHaveBeenCalledWith("1");
    });
  });
});
