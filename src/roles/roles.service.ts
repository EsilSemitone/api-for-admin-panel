import 'reflect-metadata';
import { IRolesService } from './interfaces/roles.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../injectsTypes';
import { IRolesOnUsersRepository } from './interfaces/roles.repository.interface';
import { Roles } from '@prisma/client';
import { Role } from './interfaces/roles.entity';

@injectable()
export class RolesService implements IRolesService {
    constructor(
        @inject(TYPES.Roles_Repository)
        private rolesRepository: IRolesOnUsersRepository,
    ) {}

    async set(userId: number, role: Roles): Promise<Role> {
        return this.rolesRepository.createRoleOnUser(userId, role);
    }

    async get(userId: number): Promise<Roles[]> {
        const finedRows = await this.rolesRepository.findRoleOnUser(userId);

        return finedRows.map(row => {
            return row.role;
        });
    }

    async has(userId: number, role: Roles): Promise<boolean> {
        const userRoles = await this.get(userId);
        const userHasRole = userRoles.includes(role);

        if (!userHasRole) {
            return false;
        }

        return true;
    }

    async delete(userId: number, role: Roles): Promise<number> {
        return this.rolesRepository.deleteRoleOnUser(userId, role);
    }

    async getAll(): Promise<Role[]> {
        return this.rolesRepository.getAll();
    }
}
