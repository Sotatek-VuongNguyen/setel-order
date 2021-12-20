import { IsString } from 'class-validator';

export class ProductDto {
  @IsString()
  readonly name: string;

  readonly quantity: number;

  readonly price: number;
}
