import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  MinLength,
  MaxLength,
  IsArray,
  IsOptional,
  ValidateNested,
  Min,
  Max,
  IsInt,
} from "class-validator";
import { Type } from "class-transformer";

export class ProductImageDto {
  @ApiProperty({
    description: "URL de la imagen del producto",
    example: "https://example.com/image.jpg",
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: "Texto alternativo de la imagen",
    example: "Producto en vista frontal",
    required: false,
  })
  @IsString()
  @IsOptional()
  alt?: string;

  @ApiProperty({
    description: "Orden de la imagen",
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  order?: number;
}

export class CreateProductDto {
  @ApiProperty({
    description: "Nombre del producto",
    example: "Smartphone XYZ",
    minLength: 3,
    maxLength: 100,
  })
  @IsNotEmpty({ message: "El nombre es requerido" })
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres" })
  @MaxLength(100, { message: "El nombre no puede exceder los 100 caracteres" })
  name: string;

  @ApiProperty({
    description: "Descripción del producto",
    example: "Un smartphone Samsung Galaxy S20",
  })
  @IsNotEmpty({ message: "La descripción es requerida" })
  @IsString({ message: "La descripción debe ser una cadena de texto" })
  description: string;

  @ApiProperty({
    description: "Precio",
    example: 1999900,
    minimum: 100,
    maximum: 999999900,
  })
  @IsNotEmpty({ message: "El precio es requerido" })
  @IsNumber({}, { message: "El precio debe ser un número" })
  @IsInt({ message: "El precio debe ser un número entero" })
  @IsPositive({ message: "El precio debe ser positivo" })
  price: number;

  @ApiProperty({
    description: "Cantidad disponible en stock",
    example: 10,
    minimum: 0,
  })
  @IsNotEmpty({ message: "El stock es requerido" })
  @IsNumber({}, { message: "El stock debe ser un número" })
  @IsPositive({ message: "El stock debe ser positivo" })
  stock: number;

  @ApiProperty({
    description: "Imágenes del producto",
    type: [ProductImageDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];
}
