import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Post()
  create(@Body() orderData: Partial<Order>): Promise<Order> {
    return this.ordersService.create(orderData);
  }

  @Get(':id')
findOne(@Param('id') id: number) {
  return this.ordersService.findOne(Number(id));
}

@Put(':id')
update(@Param('id') id: number, @Body() data: Partial<Order>) {
  return this.ordersService.update(Number(id), data);
}

@Delete(':id')
remove(@Param('id') id: number) {
  return this.ordersService.remove(Number(id));
}

}
