import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // No roles required, so allow access
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1]; // Extract JWT token
    console.log(token);
    if (!token) {
      return false; // No token provided, access denied
    }

    // Validate the JWT token
    const decoded = this.jwtService.verify(token);

    if (!decoded || !decoded.role) {
      return false; // If the role doesn't exist, access denied
    }

    return requiredRoles.includes(decoded.role); // Check if the user's role matches any of the required roles
  }
}
