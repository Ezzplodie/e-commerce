// user.dto.ts
import { IsNumber, IsOptional, IsString} from 'class-validator';

export class CreateProductDto {
 
  @IsOptional() 
  @IsNumber()
  category_id!: number;

  @IsString()
  name!: string;

  @IsString()
  slug!: string;


  @IsString()
  description!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  base_price!: number;
}


export class EditProductDto {
 
  @IsOptional() 
  @IsNumber()
  category_id!: number;

  @IsString()
  name!: string;

  @IsString()
  slug!: string;


  @IsString()
  description!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  base_price!: number;
}
