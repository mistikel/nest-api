// users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../../common/guards/roles.enum';
import { UserDto } from './dto/user.dto';
import { User } from './schema/user.interface';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findById: jest
              .fn()
              .mockImplementation((id: string) =>
                Promise.resolve({ username: `User ${id}`, role: 'customer' }),
              ),
            register: jest
              .fn()
              .mockResolvedValue({ username: 'New User', role: 'customer' }),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should return a single user by ID', async () => {
    const user: User = { userId: '1', username: 'User 1', role: Role.Customer };
    await expect(usersController.getProfile(user)).resolves.toEqual({
      username: 'User 1',
      role: 'customer',
    });
  });

  it('should create a new user', async () => {
    const user: UserDto = {
      username: 'NewUser',
      password: 'password',
      role: Role.Customer,
    };
    await expect(usersController.register(user)).resolves.toEqual({
      username: 'New User',
      role: 'customer',
    });
  });
});
