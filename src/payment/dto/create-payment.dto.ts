import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsObject,
  IsEmail,
  ValidateNested,
  IsNotEmpty,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

class PaymentMethodDto {
  @ApiProperty({
    description: "Tipo de método de pago",
    example: "CARD",
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: "Token de la tarjeta",
    example: "tok_stagtest_5113_395348089138aEa3eE39afed5aeA1753",
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: "Número de cuotas",
    example: 2,
  })
  @IsNumber()
  @Min(1)
  installments: number;
}

class CustomerDataDto {
  @ApiProperty({
    description: "Número de teléfono del cliente",
    example: "573307654321",
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    description: "Nombre completo del cliente",
    example: "Juan Alfonso Pérez Rodríguez",
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;
}

class ShippingAddressDto {
  @ApiProperty({
    description: "Dirección de envío línea 1",
    example: "Calle 34 # 56 - 78",
  })
  @IsString()
  @IsNotEmpty()
  address_line_1: string;

  @ApiProperty({
    description: "País",
    example: "CO",
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: "Región/Departamento",
    example: "Cundinamarca",
  })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({
    description: "Ciudad",
    example: "Bogotá",
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: "Nombre del destinatario",
    example: "Pepe Perez",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Número de teléfono del destinatario",
    example: "573109999999",
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    description: "Código postal",
    example: "111111",
  })
  @IsString()
  @IsNotEmpty()
  postal_code: string;
}

export class CreatePaymentDto {
  @ApiProperty({
    description: "Token de aceptación de términos y condiciones",
    example: "eyJhbGciOiJIUzI1NiJ9...",
  })
  @IsString()
  @IsNotEmpty()
  acceptance_token: string;

  @ApiProperty({
    description: "Token de autorización de datos personales",
    example: "eyJhbGciOiJIUzI1NiJ9...",
  })
  @IsString()
  @IsNotEmpty()
  accept_personal_auth: string;

  @ApiProperty({
    description: "Monto en centavos",
    example: 3000000,
  })
  @IsNumber()
  @Min(1)
  amount_in_cents: number;

  @ApiProperty({
    description: "Moneda",
    example: "COP",
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: "Correo electrónico del cliente",
    example: "example@wompi.co",
  })
  @IsEmail()
  customer_email: string;

  @ApiProperty({
    description: "Método de pago",
    type: PaymentMethodDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentMethodDto)
  payment_method: PaymentMethodDto;

  @ApiProperty({
    description: "Datos del cliente",
    type: CustomerDataDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => CustomerDataDto)
  customer_data: CustomerDataDto;

  @ApiProperty({
    description: "Dirección de envío",
    type: ShippingAddressDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shipping_address: ShippingAddressDto;
}
