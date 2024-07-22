import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../entities/user-roles.enum';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: UserRoles[]) => {
  return SetMetadata(META_ROLES, args);
};
