import { Roles, RolesOnUsers, Prisma } from '@prisma/client';

export interface IRolesService {
    set(userId: number, role: Roles): Promise<RolesOnUsers>;
    get(userId: number): Promise<Roles[]>;
    delete(userId: number, role: Roles): Promise<Prisma.BatchPayload>;
    has(userId: number, role: Roles): Promise<Boolean>;
    getAll(): Promise<RolesOnUsers[]>;
}
