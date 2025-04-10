import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail, IsOptional } from "class-validator";

export class DeliveryDataDto {
  @ApiProperty({
    description: "Nombre completo del destinatario",
    example: "John Doe",
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: "Correo electrónico del destinatario",
    example: "john.doe@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Número de teléfono del destinatario",
    example: "+573001234567",
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: "Dirección de entrega",
    example: "Calle 123 #45-67",
  })
  @IsString()
  @IsNotEmpty()
  address: string;

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
    description: "Instrucciones adicionales para la entrega",
    example: "Dejar con el portero",
    required: false,
  })
  @IsString()
  @IsOptional()
  deliveryInstructions?: string;
}
