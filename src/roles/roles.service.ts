import 'reflect-metadata';
import { IRolesService } from './interfaces/roles.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../injectsTypes';
import { IRolesOnUsersRepository } from './interfaces/roles.repository.interface';
import { RoleOnUser } from './roleOnUser.entity';
import { RolesType } from './roles';

@injectable()
export class RolesService implements IRolesService {
    constructor(
        @inject(TYPES.rolesRepository)
        private rolesRepository: IRolesOnUsersRepository,
    ) {}

    async set(userId: number, role: RolesType): Promise<RoleOnUser> {
        return this.rolesRepository.createRoleOnUser(userId, role);
    }

    async get(userId: number): Promise<RolesType[]> {
        const finedRows = await this.rolesRepository.findRoleOnUser(userId);

        return finedRows.map(row => {
            return row.role;
        });
    }

    async has(userId: number, role: RolesType): Promise<boolean> {
        const userRoles = await this.get(userId);
        const userHasRole = userRoles.includes(role);

        if (!userHasRole) {
            return false;
        }

        return true;
    }

    async delete(userId: number, role: RolesType): Promise<number> {
        return this.rolesRepository.deleteRoleOnUser(userId, role);
    }

    async getAll(): Promise<RoleOnUser[]> {
        return this.rolesRepository.getAll();
    }
}
