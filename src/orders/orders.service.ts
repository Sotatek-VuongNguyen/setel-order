import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import config from '../config';
import { CreatePaymentDto } from 'src/dto/create-payment.dto';
import { PaginationQueryDto } from 'src/dto/order-pagination.dto';
import { UpdateOrderDto } from 'src/dto/order-update.dto';
import { CreateOrderDto } from 'src/dto/order.dto';
import { Order } from 'src/schema/order.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private httpService: HttpService,
  ) {}

  public async findAll(paginationQuery: PaginationQueryDto): Promise<Order[]> {
    const { limit, offset } = paginationQuery;
    const query = paginationQuery.q
      ? { _id: paginationQuery.q, del_flag: 0 }
      : { del_flag: 0 };

    return await this.orderModel
      .find(query)
      .skip(Number(offset))
      .limit(Number(limit))
      .exec();
  }

  public async count(paginationQuery: PaginationQueryDto): Promise<number> {
    const query = paginationQuery.q ? { _id: paginationQuery.q } : {};

    return await this.orderModel.count(query).exec();
  }

  public async create(createOrderDto: CreateOrderDto): Promise<any> {
    const order = {
      customer: createOrderDto.customer,
      products: createOrderDto.products,
      status: 0,
      amount: createOrderDto.products
        .map((x) => x.price)
        .reduce((pre, cur) => pre + cur),
    };
    const newOrder = await new this.orderModel(order);
    return newOrder.save();
  }

  public async update(updateOrderDto: UpdateOrderDto): Promise<any> {
    return this.orderModel.updateOne(
      { _id: updateOrderDto._id },
      {
        status: updateOrderDto.status,
        updated_time: new Date().getTime(),
      },
    );
  }

  public async createPayment(createPaymentDto: CreatePaymentDto): Promise<any> {
    const obj = {
      currentTime: new Date().getTime(),
      orderId: createPaymentDto.orderId,
      amount: createPaymentDto.amount,
    };

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const md5 = require('md5');
    const request = {
      ...obj,
      checksum: md5(JSON.stringify(obj)),
    };

    try {
      this.httpService
        .post(config().paymentUrl + '/api/payment', request)
        .subscribe((res) => {
          if (!res || !res.data || res.data.status != 200) {
            const updateModel: UpdateOrderDto = {
              _id: createPaymentDto.orderId,
              status: 1,
            };

            this.update(updateModel);
            return;
          }

          const updateModel: UpdateOrderDto = {
            _id: createPaymentDto.orderId,
            status: 2,
          };

          this.update(updateModel);
          this.deliveryOrder(updateModel);
        });
    } catch (e) {
      // handle and logger
    }

    return;
  }

  public async deliveryOrder(updateOrderDto: UpdateOrderDto) {
    updateOrderDto.status = 3;
    setTimeout(() => {
      this.update(updateOrderDto);
    }, 10000);
  }
}
