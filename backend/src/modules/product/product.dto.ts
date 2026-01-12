import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsOptional,
  MinLength,
  Min,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  slug!: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @IsNumber()
  @Min(0.01)
  basePrice!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  categoryId?: number;
}
