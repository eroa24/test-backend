import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsObject,
  IsNotEmpty,
  Min,
  Max,
} from "class-validator";
import { CardDataDto } from "./credit-card.dto";
import { DeliveryDataDto } from "./delivery-dto";
import { AmountDto } from "./amount-dto";

export class CreateTransactionDto {
  @ApiProperty({
    description: "ID del producto",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: "Cantidad de productos",
    example: 1,
    minimum: 1,
    maximum: 99,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(99)
  quantity: number;

  @ApiProperty({
    description: "Información de la tarjeta de crédito",
    type: CardDataDto,
  })
  @IsObject()
  @IsNotEmpty()
  cardData: CardDataDto;

  @ApiProperty({
    description: "Información de entrega",
    type: DeliveryDataDto,
  })
  @IsObject()
  @IsNotEmpty()
  deliveryData: DeliveryDataDto;

  @ApiProperty({
    description: "Información de los montos",
    type: AmountDto,
  })
  @IsObject()
  @IsNotEmpty()
  amount: AmountDto;
}
