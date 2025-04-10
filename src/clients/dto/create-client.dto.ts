import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";

export class CreateClientDto {
  @ApiProperty({
    description: "Nombre completo del cliente",
    example: "Edilberto Roa",
    minLength: 3,
    maxLength: 100,
  })
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El nombre es requerido" })
  @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres" })
  @MaxLength(100, { message: "El nombre no puede tener más de 100 caracteres" })
  name: string;

  @ApiProperty({
    description: "Email cliente",
    example: "eroa@example.com",
    maxLength: 100,
  })
  @IsEmail({}, { message: "El email debe ser válido" })
  @IsNotEmpty({ message: "El email es requerido" })
  @MaxLength(100, {
    message: "El email no puede tener más de 100 caracteres",
  })
  email: string;

  @ApiProperty({
    description: "Número de teléfono del cliente",
    example: "+573001234567",
    maxLength: 20,
  })
  @IsString({ message: "El teléfono debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El teléfono es requerido" })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: "El teléfono debe tener un formato válido (E.164)",
  })
  @MaxLength(20, {
    message: "El teléfono no puede tener más de 20 caracteres",
  })
  phone: string;

  @ApiProperty({
    description: "Dirección del cliente",
    example: "Calle 123 ",
    maxLength: 200,
  })
  @IsString({ message: "La dirección debe ser una cadena de texto" })
  @IsNotEmpty({ message: "La dirección es requerida" })
  @MaxLength(200, {
    message: "La dirección no puede tener más de 200 caracteres",
  })
  address: string;
}
