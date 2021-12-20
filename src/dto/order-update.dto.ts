import { IsEnum, IsString } from 'class-validator';
import { OrderStatusEnum } from 'src/enum/order.enum';

export class UpdateOrderDto {
  @IsString()
  public _id: string;

  @IsEnum(OrderStatusEnum)
  public status: OrderStatusEnum;
}
