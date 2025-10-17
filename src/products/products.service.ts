import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    try {
      return await this.productsRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      const product = await this.productsRepository.findOneBy({ id });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch product');
    }
  }

  async create(productData: Partial<Product>): Promise<Product> {
    try {
      if (!productData || Object.keys(productData).length === 0) {
        throw new BadRequestException('Product data cannot be empty');
      }
      const newProduct = this.productsRepository.create(productData);
      return await this.productsRepository.save(newProduct);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async update(id: number, updateData: Partial<Product>): Promise<Product> {
    try {
      if (!updateData || Object.keys(updateData).length === 0) {
        throw new BadRequestException('Update data cannot be empty');
      }
      
      const product = await this.findOne(id);
      const result = await this.productsRepository.update(id, updateData);
      
      if (result.affected === 0) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update product');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const product = await this.findOne(id);
      const result = await this.productsRepository.delete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete product');
    }
  }
}
