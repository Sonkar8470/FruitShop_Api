import { Controller, Get, Post, Body, Delete, Param, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Post()
  create(@Body() productData: Partial<Product>): Promise<Product> {
    return this.productsService.create(productData);
  }

  @Get(':id')
findOne(@Param('id') id: number) {
  return this.productsService.findOne(Number(id));
}

@Put(':id')
update(@Param('id') id: number, @Body() data: Partial<Product>) {
  return this.productsService.update(Number(id), data);
}

@Delete(':id')
remove(@Param('id') id: number) {
  return this.productsService.remove(Number(id));
}

}
