import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ProductSchema } from '../products/schema/product.schema';
import { UserSchema } from '../users/schema/user.schema';
import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';
import { ClaimSchema } from './schema/claim.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Claim', schema: ClaimSchema }]),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AuthModule,
  ],
  controllers: [ClaimsController],
  providers: [ClaimsService],
})
export class ClaimsModule {}
