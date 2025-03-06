import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  local: string;

  @Transform(({ value }: { value: string | Date }) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)',
      );
    }
    return date;
  })
  date: Date;

  @IsNumber()
  @IsPositive()
  capacity: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  organizer: number;

  @IsNumber()
  @IsPositive()
  category_id: number;
}
