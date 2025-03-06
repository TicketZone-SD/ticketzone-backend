import { IsEnum, IsInt, IsPositive, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @IsPositive()
  user_id: number;

  @IsInt()
  @IsPositive()
  event_id: number;

  @IsInt()
  @IsPositive()
  ticket_type_id: number;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsPositive()
  total_price: number;

  @IsOptional()
  @IsEnum(['Pendente', 'Pago', 'Cancelado'])
  status?: string; // Se quiser que o status seja opcional no momento da criação
}
