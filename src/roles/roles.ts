export const Roles = {
    USER: 'USER',
    GENERAL_WAREHOUSE: 'GENERAL_WAREHOUSE',
    ADMIN: 'ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type RolesType = keyof typeof Roles;

export function isRoleType(role: string): role is RolesType {
    return Object.values(Roles).includes(role as RolesType);
}
