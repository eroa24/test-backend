import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { DeliveryStatus } from "../entities/delivery.entity";

export class UpdateDeliveryStatusDto {
  @ApiProperty({
    description: "Estado del delivery",
    enum: DeliveryStatus,
    example: DeliveryStatus.IN_PROGRESS,
  })
  @IsEnum(DeliveryStatus)
  status: DeliveryStatus;
}
