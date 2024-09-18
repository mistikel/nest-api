// auth.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({ access_token: 'jwt_token' }),
            validateUser: jest
              .fn()
              .mockImplementation((username: string, password: string) =>
                Promise.resolve({ username: `${username}`, role: 'customer' }),
              ),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should login a user and return a token', async () => {
    const loginDto = { username: 'testuser', password: 'password' };
    await expect(authController.login(loginDto)).resolves.toEqual({
      access_token: 'jwt_token',
    });
  });
});
