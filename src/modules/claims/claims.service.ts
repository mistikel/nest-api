import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../products/schema/product.interface';
import { User } from '../users/schema/user.interface';
import { Claim } from './schema/claim.interface';

@Injectable()
export class ClaimsService {
  constructor(
    @InjectModel('Claim') private claimModel: Model<Claim>,
    @InjectModel('Product') private productModel: Model<Product>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async createClaim(
    customerId: string,
    productId: string,
    description: string,
  ): Promise<Claim> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const newClaim = new this.claimModel({
      product: productId,
      userId: customerId,
      description,
    });

    return newClaim.save();
  }

  async getClaimsByCustomer(customerId: string): Promise<Claim[]> {
    return this.claimModel.find({ userId: customerId }).populate('product');
  }

  async getAllClaims(): Promise<Claim[]> {
    return this.claimModel.find().populate('product');
  }

  async updateClaimStatus(claimId: string, status: string): Promise<Claim> {
    const claim = await this.claimModel.findById(claimId);
    if (!claim) {
      throw new NotFoundException('Claim not found');
    }
    claim.status = status;
    return claim.save();
  }
}
