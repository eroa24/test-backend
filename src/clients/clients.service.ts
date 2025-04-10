import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Client } from "./entities/client.entity";
import { CreateClientDto } from "./dto/create-client.dto";
import {
  ClientCreationException,
  ClientValidationException,
  ClientDuplicateException,
  ClientNotFoundException,
} from "./exceptions/client.exception";

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    try {
      // const existingClient = await this.clientRepository.findOne({
      //   where: { email: createClientDto.email },
      // });

      // if (existingClient) {
      //   throw new ClientDuplicateException(createClientDto.email);
      // }

      const client = this.clientRepository.create(createClientDto);

      const savedClient = await this.clientRepository.save(client);

      return savedClient;
    } catch (error) {
      this.logger.error(
        `Error al crear cliente: ${error.message}`,
        error.stack
      );

      if (
        error instanceof ClientCreationException ||
        error instanceof ClientValidationException ||
        error instanceof ClientDuplicateException
      ) {
        throw error;
      }

      throw new ClientCreationException("Error al crear el cliente", {
        originalError: error.message,
      });
    }
  }

  async findOne(id: string): Promise<Client> {
    try {
      const client = await this.clientRepository.findOne({
        where: { id },
      });
      console.log(client, "ERRPR");

      if (!client) {
        throw new ClientNotFoundException(id);
      }

      return client;
    } catch (error) {
      this.logger.error(
        `Error al obtener cliente: ${error.message}`,
        error.stack
      );

      if (error instanceof ClientNotFoundException) {
        throw error;
      }

      throw new ClientCreationException("Error al obtener el cliente", {
        originalError: error.message,
      });
    }
  }

  async findByEmail(user: CreateClientDto): Promise<Client> {
    try {
      const { email } = user;
      const client = await this.clientRepository.findOne({
        where: { email, isActive: true },
      });

      if (!client) {
        return await this.create(user);
      }

      return client;
    } catch (error) {
      this.logger.error(
        `Error al obtener cliente: ${error.message}`,
        error.stack
      );

      if (error instanceof ClientNotFoundException) {
        throw error;
      }

      throw new ClientCreationException("Error al obtener el cliente", {
        originalError: error.message,
      });
    }
  }
}
