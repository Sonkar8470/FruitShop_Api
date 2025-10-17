import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<Order[]> {
    try {
      return await this.ordersRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch orders');
    }
  }

  async findOne(id: number): Promise<Order> {
    try {
      const order = await this.ordersRepository.findOneBy({ id });
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch order');
    }
  }

  async create(orderData: Partial<Order>): Promise<Order> {
    try {
      if (!orderData || Object.keys(orderData).length === 0) {
        throw new BadRequestException('Order data cannot be empty');
      }
      const newOrder = this.ordersRepository.create(orderData);
      return await this.ordersRepository.save(newOrder);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  async update(id: number, updateData: Partial<Order>): Promise<Order> {
    try {
      if (!updateData || Object.keys(updateData).length === 0) {
        throw new BadRequestException('Update data cannot be empty');
      }
      
      const order = await this.findOne(id);
      const result = await this.ordersRepository.update(id, updateData);
      
      if (result.affected === 0) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update order');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const order = await this.findOne(id);
      const result = await this.ordersRepository.delete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete order');
    }
  }
}
