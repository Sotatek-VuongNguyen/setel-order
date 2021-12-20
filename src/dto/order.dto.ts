import { CustomerDto } from './customer.dto';
import { ProductDto } from './product.dto';

export class CreateOrderDto {
  readonly customer: CustomerDto;
  readonly products: ProductDto[];
}
