import { Roles, RolesOnUsers } from '@prisma/client';

export interface IRolesOnUsersRepository {
    createRoleOnUser(userId: number, role: Roles): Promise<RolesOnUsers>;
    findRoleOnUser(userId: number): Promise<RolesOnUsers[]>;
}
