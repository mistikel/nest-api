import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/guards/current-user.decorator';
import { Role } from '../../common/guards/roles.enum';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { User } from '../users/schema/user.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { Product } from './schema/product.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Customer can view all products
  @UseGuards(JwtAuthGuard)
  @Get()
  getAllProducts(@CurrentUser() user: User): Promise<Product[]> {
    if (user.role === Role.Customer) {
      return this.productsService.findByUserId(user.userId);
    } else if (user.role === Role.Staff) {
      return this.productsService.findAll();
    } else {
      throw new ForbiddenException('Invalid role');
    }
  }

  // Staff can create a new product (only accessible by staff)
  @UseGuards(JwtAuthGuard)
  @Post()
  createProduct(
    @CurrentUser() user: User,
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.create(user, createProductDto);
  }

  // Customer and staff can view a product by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getProductById(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  // Staff can update a product (only accessible by staff)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  // Staff can delete a product (only accessible by staff)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
