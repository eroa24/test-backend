import { Test, TestingModule } from "@nestjs/testing";
import { ClientsService } from "../clients.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Client } from "../entities/client.entity";
import { Repository } from "typeorm";
import { CreateClientDto } from "../dto/create-client.dto";
import {
  ClientNotFoundException,
  ClientCreationException,
  ClientValidationException,
  ClientDuplicateException,
} from "../exceptions/client.exception";
import { Logger } from "@nestjs/common";

describe("ClientsService", () => {
  let service: ClientsService;
  let repository: Repository<Client>;

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
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    repository = module.get<Repository<Client>>(getRepositoryToken(Client));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a new client", async () => {
      jest.spyOn(repository, "create").mockReturnValue(mockClient);
      jest.spyOn(repository, "save").mockResolvedValue(mockClient);

      const result = await service.create(mockCreateClientDto);

      expect(result).toEqual(mockClient);
      expect(repository.create).toHaveBeenCalledWith(mockCreateClientDto);
      expect(repository.save).toHaveBeenCalledWith(mockClient);
    });

    it("should handle general errors during client creation", async () => {
      const error = new Error("Error al crear el cliente");
      jest.spyOn(repository, "create").mockReturnValue(mockClient);
      jest.spyOn(repository, "save").mockRejectedValue(error);
      jest.spyOn(Logger.prototype, "error");

      await expect(service.create(mockCreateClientDto)).rejects.toThrow(
        "Error al crear el cliente"
      );
      expect(Logger.prototype.error).toHaveBeenCalled();
    });

    it("should handle ClientCreationException during client creation", async () => {
      const error = new ClientCreationException("Error específico de creación");
      jest.spyOn(repository, "create").mockReturnValue(mockClient);
      jest.spyOn(repository, "save").mockRejectedValue(error);
      jest.spyOn(Logger.prototype, "error");

      await expect(service.create(mockCreateClientDto)).rejects.toThrow(
        ClientCreationException
      );
      expect(Logger.prototype.error).toHaveBeenCalled();
    });

    it("should handle ClientValidationException during client creation", async () => {
      const error = new ClientValidationException("Error de validación");
      jest.spyOn(repository, "create").mockReturnValue(mockClient);
      jest.spyOn(repository, "save").mockRejectedValue(error);
      jest.spyOn(Logger.prototype, "error");

      await expect(service.create(mockCreateClientDto)).rejects.toThrow(
        ClientValidationException
      );
      expect(Logger.prototype.error).toHaveBeenCalled();
    });

    it("should handle ClientDuplicateException during client creation", async () => {
      const error = new ClientDuplicateException("Cliente duplicado");
      jest.spyOn(repository, "create").mockReturnValue(mockClient);
      jest.spyOn(repository, "save").mockRejectedValue(error);
      jest.spyOn(Logger.prototype, "error");

      await expect(service.create(mockCreateClientDto)).rejects.toThrow(
        ClientDuplicateException
      );
      expect(Logger.prototype.error).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a client by id", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(mockClient);

      const result = await service.findOne("1");

      expect(result).toEqual(mockClient);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should throw ClientNotFoundException when client not found", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(null);

      await expect(service.findOne("1")).rejects.toThrow(
        ClientNotFoundException
      );
    });

    it("should handle general errors in findOne", async () => {
      const error = new Error("Error al buscar cliente");
      jest.spyOn(repository, "findOne").mockRejectedValue(error);
      jest.spyOn(Logger.prototype, "error");

      await expect(service.findOne("1")).rejects.toThrow(
        "Error al obtener el cliente"
      );
      expect(Logger.prototype.error).toHaveBeenCalled();
    });
  });

  describe("findByEmail", () => {
    it("should return existing client when found by email", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(mockClient);

      const result = await service.findByEmail(mockCreateClientDto);

      expect(result).toEqual(mockClient);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: mockCreateClientDto.email, isActive: true },
      });
    });

    it("should create and return new client when not found by email", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(null);
      jest.spyOn(repository, "create").mockReturnValue(mockClient);
      jest.spyOn(repository, "save").mockResolvedValue(mockClient);

      const result = await service.findByEmail(mockCreateClientDto);

      expect(result).toEqual(mockClient);
      expect(repository.create).toHaveBeenCalledWith(mockCreateClientDto);
      expect(repository.save).toHaveBeenCalledWith(mockClient);
    });

    it("should handle ClientNotFoundException in findByEmail", async () => {
      const error = new ClientNotFoundException("1");
      jest.spyOn(repository, "findOne").mockRejectedValue(error);
      jest.spyOn(Logger.prototype, "error");

      await expect(service.findByEmail(mockCreateClientDto)).rejects.toThrow(
        ClientNotFoundException
      );
      expect(Logger.prototype.error).toHaveBeenCalled();
    });

    it("should handle general errors in findByEmail", async () => {
      const error = new Error("Error al buscar por email");
      jest.spyOn(repository, "findOne").mockRejectedValue(error);
      jest.spyOn(Logger.prototype, "error");

      await expect(service.findByEmail(mockCreateClientDto)).rejects.toThrow(
        "Error al obtener el cliente"
      );
      expect(Logger.prototype.error).toHaveBeenCalled();
    });
  });
});
