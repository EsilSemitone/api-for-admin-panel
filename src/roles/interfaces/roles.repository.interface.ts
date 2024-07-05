import { Prisma, Roles } from '@prisma/client';
import { Role } from './roles.entity';

export interface IRolesOnUsersRepository {
    createRoleOnUser(userId: number, role: Roles): Promise<Role>;
    findRoleOnUser(userId: number): Promise<Role[]>;
    deleteRoleOnUser(userId: number, role: Roles): Promise<number>;
    getAll(): Promise<Role[]>;
}
