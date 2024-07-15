import { RolesType } from '../roles';
import { RoleOnUser } from '../roleOnUser.entity';

export interface IRolesService {
    set(userId: number, role: RolesType): Promise<RoleOnUser>;
    get(userId: number): Promise<RolesType[]>;
    delete(userId: number, role: RolesType): Promise<number>;
    has(userId: number, role: RolesType): Promise<Boolean>;
    getAll(): Promise<RoleOnUser[]>;
}
