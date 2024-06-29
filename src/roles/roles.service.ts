import 'reflect-metadata';
import { IRolesService } from './interfaces/roles.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../injectsTypes';
import { IRolesOnUsersRepository } from './interfaces/roles.repository.interface';
import { Roles, RolesOnUsers, Prisma } from '@prisma/client';

@injectable()
export class RolesService implements IRolesService {
    constructor(
        @inject(TYPES.Roles_Repository)
        private rolesRepository: IRolesOnUsersRepository,
    ) {}

    async set(userId: number, role: Roles): Promise<RolesOnUsers> {
        return this.rolesRepository.createRoleOnUser(userId, role);
    }

    async get(userId: number): Promise<Roles[]> {
        const finedRows = await this.rolesRepository.findRoleOnUser(userId);

        return finedRows.map(row => {
            return row.role;
        });
    }

    async has(userId: number, role: Roles): Promise<Boolean> {
        const userRoles = await this.get(userId);
        const userHasRole = userRoles.includes(role);

        if (!userHasRole) {
            return false;
        }

        return true;
    }

    async delete(userId: number, role: Roles): Promise<Prisma.BatchPayload> {
        return this.rolesRepository.deleteRoleOnUser(userId, role);
    }

    async getAll(): Promise<RolesOnUsers[]> {
        return this.rolesRepository.getAll();
    }
}
