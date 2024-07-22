export enum UserRoles {
  GUARDIAN = 'Tutor',
  SECURITY_PERSONNEL = 'Personal de seguridad',
  ADMINISTRATOR = 'Administrador',
}

export const RoleExpiryTimes = {
  [UserRoles.GUARDIAN]: '1h',
  [UserRoles.SECURITY_PERSONNEL]: '30m',
  [UserRoles.ADMINISTRATOR]: '30m',
};
