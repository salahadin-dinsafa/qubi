import { SetMetadata } from "@nestjs/common";

import { Roles } from "../../users/types/roles.type";

export const ROLES_KEY = 'roles';
export const Role = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);