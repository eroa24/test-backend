import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Length, IsBoolean } from "class-validator";

export class CardDataDto {
  @ApiProperty({
    description: "Número de la tarjeta de crédito",
    example: "4111 1111 1111 1111",
    minLength: 16,
    maxLength: 19,
  })
  @IsString()
  @IsNotEmpty()
  @Length(16, 19)
  cardNumber: string;

  @ApiProperty({
    description: "Fecha de expiración de la tarjeta",
    example: "12/25",
    pattern: "^(0[1-9]|1[0-2])/([0-9]{2})$",
  })
  @IsString()
  @IsNotEmpty()
  expiryDate: string;

  @ApiProperty({
    description: "Código de seguridad de la tarjeta",
    example: "123",
    minLength: 3,
    maxLength: 4,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 4)
  cvc: string;

  @ApiProperty({
    description: "Nombre del titular de la tarjeta",
    example: "John Doe",
  })
  @IsString()
  @IsNotEmpty()
  cardName: string;

  @ApiProperty({
    description: "Numero de cuotas",
    example: "1",
  })
  @IsString()
  @IsNotEmpty()
  installments: string;

  @ApiProperty({
    description: "Aceptación de términos y condiciones",
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  termsAccepted: boolean;

  @ApiProperty({
    description: "Aceptación de procesamiento de datos",
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  dataProcessingAccepted: boolean;
}
