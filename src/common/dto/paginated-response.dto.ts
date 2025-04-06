import { ApiProperty } from "@nestjs/swagger";

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: "Lista de elementos" })
  items: T[];

  @ApiProperty({ description: "Número total de elementos" })
  total: number;

  @ApiProperty({ description: "Número de página actual" })
  page: number;

  @ApiProperty({ description: "Número de elementos por página" })
  limit: number;

  @ApiProperty({ description: "Número total de páginas" })
  totalPages: number;
}
