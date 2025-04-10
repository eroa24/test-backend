import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsDateString,
} from "class-validator";

export class CreateDeliveryDto {
  @ApiProperty({
    description: "ID de la transacción asociada",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({
    description: "Dirección de entrega",
    example: "Calle 123 #45-67",
  })
  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @ApiProperty({
    description: "Ciudad de entrega",
    example: "Bogotá",
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: "Código postal",
    example: "110111",
  })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({
    description: "Nombre del destinatario",
    example: "Edilberto Roa",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Teléfono del destinatario",
    example: "+573001234567",
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
