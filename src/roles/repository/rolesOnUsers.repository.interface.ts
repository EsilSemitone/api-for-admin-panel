import { Prisma, Roles, RolesOnUsers } from '@prisma/client';

export interface IRolesOnUsersRepository {
    createRoleOnUser(userId: number, role: Roles): Promise<RolesOnUsers>;
    findRoleOnUser(userId: number): Promise<RolesOnUsers[]>;
    deleteRoleOnUser(userId: number, role: Roles): Promise<Prisma.BatchPayload>;
    getAll(): Promise<RolesOnUsers[]>;
}
