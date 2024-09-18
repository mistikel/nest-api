import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../../common/guards/roles.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';

describe('ClaimsController', () => {
  let claimsController: ClaimsController;
  let claimsService: ClaimsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClaimsController],
      providers: [
        {
          provide: ClaimsService,
          useValue: {
            createClaim: jest.fn(),
            getClaimsByCustomer: jest.fn(),
            getAllClaims: jest.fn(),
            updateClaimStatus: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    claimsController = module.get<ClaimsController>(ClaimsController);
    claimsService = module.get<ClaimsService>(ClaimsService);
  });

  describe('createClaim', () => {
    it('should allow a customer to create a claim', async () => {
      const user = {
        userId: '123',
        role: Role.Customer,
        username: 'test',
        password: 'test',
      };
      const body = { productId: '1', description: 'Product issue' };
      const newClaim = {
        _id: '1',
        userId: '123',
        product: '1',
        description: 'Product issue',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(claimsService, 'createClaim').mockResolvedValue(newClaim);

      const result = await claimsController.createClaim(user, body);
      expect(result).toEqual(newClaim);
      expect(claimsService.createClaim).toHaveBeenCalledWith(
        user.userId,
        body.productId,
        body.description,
      );
    });

    it('should throw ForbiddenException if user is not a customer', async () => {
      const user = {
        userId: '123',
        role: Role.Staff,
        username: 'test',
        password: 'test',
      };
      const body = { productId: '1', description: 'Product issue' };

      await expect(claimsController.createClaim(user, body)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getClaimsByCustomer', () => {
    it('should return claims for a customer', async () => {
      const user = {
        userId: '123',
        role: Role.Customer,
        username: 'test',
        password: 'test',
      };
      const claims = [
        {
          _id: '1',
          userId: '123',
          product: '1',
          description: 'Product issue',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest
        .spyOn(claimsService, 'getClaimsByCustomer')
        .mockResolvedValue(claims);

      const result = await claimsController.getClaimsByCustomer(user);
      expect(result).toEqual(claims);
      expect(claimsService.getClaimsByCustomer).toHaveBeenCalledWith(
        user.userId,
      );
    });

    it('should return all claims for staff', async () => {
      const user = {
        userId: '123',
        role: Role.Staff,
        username: 'test',
        password: 'test',
      };
      const claims = [
        {
          _id: '1',
          product: '1',
          userId: '345',
          description: 'Product issue',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: '2',
          product: '2',
          userId: '678',
          description: 'Another issue',
          status: 'approved',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(claimsService, 'getAllClaims').mockResolvedValue(claims);

      const result = await claimsController.getClaimsByCustomer(user);
      expect(result).toEqual(claims);
      expect(claimsService.getAllClaims).toHaveBeenCalled();
    });
  });

  describe('updateClaimStatus', () => {
    it('should allow staff to update a claim status', async () => {
      const id = '1';
      const body = { status: 'approved' };
      const updatedClaim = {
        _id: '1',
        userId: '123',
        product: '1',
        description: 'Product issue',
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(claimsService, 'updateClaimStatus')
        .mockResolvedValue(updatedClaim);

      const result = await claimsController.updateClaimStatus(id, body);
      expect(result).toEqual(updatedClaim);
      expect(claimsService.updateClaimStatus).toHaveBeenCalledWith(
        id,
        body.status,
      );
    });
  });
});
