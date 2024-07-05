import { Roles, RolesOnUsers, Prisma } from '@prisma/client';
import { Role } from './roles.entity';

export interface IRolesService {
    set(userId: number, role: Roles): Promise<Role>;
    get(userId: number): Promise<Roles[]>;
    delete(userId: number, role: Roles): Promise<number>;
    has(userId: number, role: Roles): Promise<Boolean>;
    getAll(): Promise<Role[]>;
}
