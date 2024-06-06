import { Roles } from '@prisma/client';

export function isRole(role: unknown): role is Roles {
    const validRoles: Roles[] = Object.values(Roles);

    if (validRoles.includes(role as Roles)) {
        return true;
    }

    return false;
}
