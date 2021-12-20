export interface IOrder {
  _id: string;
  amount: number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  customer: Object;
  // eslint-disable-next-line @typescript-eslint/ban-types
  product: Object;
}
