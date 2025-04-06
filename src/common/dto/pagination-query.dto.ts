import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

export class PaginationQueryDto {
  @ApiProperty({
    description: "Número de página",
    example: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: "Número de elementos por página",
    example: 10,
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
