import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty } from "class-validator";

export class AmountDto {
  @ApiProperty({
    description: "Subtotal de la compra",
    example: 100000,
  })
  @IsNumber()
  @IsNotEmpty()
  subtotal: number;

  @ApiProperty({
    description: "Monto del impuesto (IVA)",
    example: 19000,
  })
  @IsNumber()
  @IsNotEmpty()
  tax: number;

  @ApiProperty({
    description: "Costo del envío",
    example: 10000,
  })
  @IsNumber()
  @IsNotEmpty()
  shipping: number;

  @ApiProperty({
    description: "Total de la transacción",
    example: 129000,
  })
  @IsNumber()
  @IsNotEmpty()
  total: number;
}
