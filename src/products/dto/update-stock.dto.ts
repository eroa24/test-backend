import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsInt } from "class-validator";

export class UpdateStockDto {
  @ApiProperty({
    description: "Modifica stock",
    example: -2,
    examples: [2, -2],
  })
  @IsNumber({}, { message: "La cantidad debe ser un número" })
  @IsInt({ message: "La cantidad debe ser un número entero" })
  quantity: number;
}
