// products.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../../common/guards/roles.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAll: jest
              .fn()
              .mockResolvedValue([
                { name: 'Product1', description: 'Test product' },
              ]),
            findOne: jest
              .fn()
              .mockImplementation((id: string) =>
                Promise.resolve({
                  name: `Product ${id}`,
                  description: 'Test product',
                }),
              ),
            create: jest
              .fn()
              .mockResolvedValue({
                name: 'Created Product',
                description: 'Test product',
              }),
            update: jest
              .fn()
              .mockResolvedValue({
                name: 'Updated Product',
                description: 'Updated test product',
              }),
            remove: jest.fn().mockResolvedValue({}),
            findByUserId: jest
              .fn()
              .mockImplementation((id: string) =>
                Promise.resolve([
                  { name: `Product ${id}`, description: 'Test product' },
                ]),
              ),
          },
        },
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
  });

  it('should return an array of products', async () => {
    const user = {
      userId: '123',
      role: Role.Customer,
      username: 'test',
      password: 'test',
    };
    await expect(productsController.getAllProducts(user)).resolves.toEqual([
      { name: 'Product 123', description: 'Test product' },
    ]);
  });

  it('should return a product by ID', async () => {
    await expect(productsController.getProductById('1')).resolves.toEqual({
      name: 'Product 1',
      description: 'Test product',
    });
  });

  it('should create a new product', async () => {
    const user = {
      userId: '123',
      role: Role.Customer,
      username: 'test',
      password: 'test',
    };
    const product: CreateProductDto = {
      name: 'New Product',
      description: 'Test product',
      price: 1000,
      warrantyPeriod: 1,
    };
    await expect(
      productsController.createProduct(user, product),
    ).resolves.toEqual({
      name: 'Created Product',
      description: 'Test product',
    });
  });

  it('should update a product', async () => {
    const product: UpdateProductDto = {
      name: 'Updated Product',
      description: 'Updated test product',
    };
    await expect(
      productsController.updateProduct('1', product),
    ).resolves.toEqual(product);
  });

  it('should delete a product', async () => {
    await expect(productsController.deleteProduct('1')).resolves.toEqual({});
  });
});
