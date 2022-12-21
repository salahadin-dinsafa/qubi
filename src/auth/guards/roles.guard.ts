import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserEntity } from '../../users/entities/user.entity';
import { Roles } from '../../users/types/roles.type';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }
  canActivate(
    context: ExecutionContext,
  ): boolean {

    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])


    if (!requiredRoles) return true;

    const { user }: { user: UserEntity } = context.switchToHttp().getRequest();

    return requiredRoles.some(role => user.role?.includes(role));
  }
}
