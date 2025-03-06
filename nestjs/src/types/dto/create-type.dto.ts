import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateTypeDto {
  @IsNumber()
  @IsPositive()
  event_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  capacity: number;
}
