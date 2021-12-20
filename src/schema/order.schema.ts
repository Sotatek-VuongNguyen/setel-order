import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CustomerDto } from 'src/dto/customer.dto';
import { ProductDto } from 'src/dto/product.dto';

@Schema()
export class Order extends Document {
  @Prop()
  status: number;

  @Prop()
  amount: number;

  @Prop()
  customer: CustomerDto;

  @Prop()
  products: Array<ProductDto>;

  @Prop({ default: new Date().getTime() })
  created_time: number;

  @Prop({ default: new Date().getTime() })
  updated_time: number;

  @Prop({ default: 0 })
  del_flag: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
