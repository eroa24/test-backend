import { Controller, Post, Body, Get, Param, Patch, Put } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { DeliveriesService } from "./deliveries.service";
import { CreateDeliveryDto } from "./dto/create-delivery.dto";
import { UpdateDeliveryStatusDto } from "./dto/update-delivery-status.dto";
import { Delivery } from "./entities/delivery.entity";

@ApiTags("Deliveries")
@Controller("deliveries")
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  @ApiOperation({ summary: "Crear un nuevo delivery" })
  @ApiResponse({
    status: 201,
    description: "Delivery creado exitosamente",
    type: Delivery,
  })
  @ApiResponse({
    status: 400,
    description: "Datos de delivery inválidos",
  })
  @ApiResponse({
    status: 404,
    description: "Transacción no encontrada",
  })
  create(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveriesService.create(createDeliveryDto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un delivery por ID" })
  @ApiResponse({
    status: 200,
    description: "Delivery encontrado exitosamente",
    type: Delivery,
  })
  @ApiResponse({
    status: 404,
    description: "Delivery no encontrado",
  })
  getDelivery(@Param("id") id: string) {
    return this.deliveriesService.getDelivery(id);
  }

  @Put(":id/status")
  @ApiOperation({ summary: "Actualizar el estado de un delivery" })
  @ApiResponse({
    status: 200,
    description: "Estado del delivery actualizado exitosamente",
    type: Delivery,
  })
  @ApiResponse({
    status: 404,
    description: "Delivery no encontrado",
  })
  updateDeliveryStatus(
    @Param("id") id: string,
    @Body() updateDeliveryStatusDto: UpdateDeliveryStatusDto
  ) {
    return this.deliveriesService.updateDeliveryStatus(
      id,
      updateDeliveryStatusDto
    );
  }
}
