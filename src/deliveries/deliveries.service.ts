import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Delivery, DeliveryStatus } from "./entities/delivery.entity";
import { CreateDeliveryDto } from "./dto/create-delivery.dto";
import { UpdateDeliveryStatusDto } from "./dto/update-delivery-status.dto";
import {
  DeliveryNotFoundException,
  DeliveryStatusUpdateException,
} from "./exceptions/deliveries.exception";

@Injectable()
export class DeliveriesService {
  private readonly logger = new Logger(DeliveriesService.name);

  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>
  ) {}

  async create(createDeliveryDto: CreateDeliveryDto) {
    try {
      const { transactionId, ...deliveryData } = createDeliveryDto;

      const delivery = this.deliveryRepository.create({
        ...deliveryData,
        transaction: { id: transactionId },
        status: DeliveryStatus.PENDING,
        trackingNumber: this.generateTrackingNumber(),
        deliveredDate: null,
        estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      const savedDelivery = await this.deliveryRepository.save(delivery);

      return savedDelivery;
    } catch (error) {
      this.logger.error(
        `Error al crear delivery: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  private generateTrackingNumber(): string {
    const prefix = "DEL";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  async getDelivery(id: string) {
    try {
      const delivery = await this.deliveryRepository.findOne({
        where: { id },
      });
      return delivery;
    } catch (error) {
      throw new DeliveryNotFoundException(
        `Delivery con ID ${id} no encontrada`
      );
    }
  }

  async updateDeliveryStatus(id: string, updateDto: UpdateDeliveryStatusDto) {
    try {
      const delivery = await this.getDelivery(id);
      if (delivery.status === DeliveryStatus.DELIVERED) {
        throw new DeliveryStatusUpdateException(
          "No se puede actualizar el estado de un delivery ya entregado"
        );
      }

      if (updateDto.status === DeliveryStatus.DELIVERED) {
        delivery.deliveredDate = new Date();
      }

      delivery.status = updateDto.status;
      await this.deliveryRepository.save(delivery);
      return delivery;
    } catch (error) {
      throw new DeliveryStatusUpdateException(
        `Error al actualizar el estado del delivery: ${error.message}`
      );
    }
  }
}
