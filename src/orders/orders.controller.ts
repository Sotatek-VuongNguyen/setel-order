import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { CreatePaymentDto } from 'src/dto/create-payment.dto';
import { PaginationQueryDto } from 'src/dto/order-pagination.dto';
import { UpdateOrderDto } from 'src/dto/order-update.dto';
import { CreateOrderDto } from 'src/dto/order.dto';
import { OrderStatusEnum } from 'src/enum/order.enum';
import { OrdersService } from './orders.service';

@Controller('api/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}
  @Get()
  public async getAllOrder(
    @Res() res,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const orders = await this.ordersService.findAll(paginationQuery);
    const total = await this.ordersService.count(paginationQuery);
    return res
      .status(HttpStatus.OK)
      .json({ status: true, data: orders, total });
  }

  @Post()
  public async addOrder(@Res() res, @Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.ordersService.create(createOrderDto);

      const createPaymentdto: CreatePaymentDto = {
        orderId: order._id,
        amount: order.amount,
      };

      this.ordersService.createPayment(createPaymentdto);
      return res.status(HttpStatus.OK).json({
        message: 'Order has been created successfully',
        order,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: Order not created!',
        status: 400,
      });
    }
  }

  @Put()
  public async updateOrder(@Res() res, @Body() updateOrderDto: UpdateOrderDto) {
    try {
      if (
        updateOrderDto.status !== OrderStatusEnum.confirmed &&
        updateOrderDto.status !== OrderStatusEnum.cancelled
      )
        throw new Error('Status invalid');

      const order = await this.ordersService.update(updateOrderDto);
      return res.status(HttpStatus.OK).json({
        message: 'Order has been updated successfully',
        order,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
        status: 400,
      });
    }
  }
}
