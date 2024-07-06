import { RoleOnUser } from '../roleOnUser.entity';
import { RolesType } from '../roles';

export interface IRolesOnUsersRepository {
    createRoleOnUser(userId: number, role: RolesType): Promise<RoleOnUser>;
    findRoleOnUser(userId: number): Promise<RoleOnUser[]>;
    deleteRoleOnUser(userId: number, role: RolesType): Promise<number>;
    getAll(): Promise<RoleOnUser[]>;
}
