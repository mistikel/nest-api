import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/guards/current-user.decorator';
import { Roles } from '../../common/guards/roles.decorator';
import { Role } from '../../common/guards/roles.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { User } from '../users/schema/user.interface';
import { ClaimsService } from './claims.service';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createClaim(
    @CurrentUser() user: User,
    @Body() body: { productId: string; description: string },
  ) {
    if (user.role !== Role.Customer) {
      throw new ForbiddenException('Only customers can create claims');
    }
    return this.claimsService.createClaim(
      user.userId,
      body.productId,
      body.description,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getClaimsByCustomer(@CurrentUser() user: User) {
    if (user.role === Role.Customer) {
      return this.claimsService.getClaimsByCustomer(user.userId);
    } else if (user.role === Role.Staff) {
      return this.claimsService.getAllClaims();
    } else {
      throw new ForbiddenException('Invalid role');
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Staff)
  @Put(':id/status')
  async updateClaimStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.claimsService.updateClaimStatus(id, body.status);
  }
}
