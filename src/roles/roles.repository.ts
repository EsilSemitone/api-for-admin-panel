import 'reflect-metadata';
import { Roles } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../injectsTypes';
import { IRolesOnUsersRepository } from './interfaces/roles.repository.interface';
import { injectable, inject } from 'inversify';
import { Role } from './interfaces/roles.entity';

@injectable()
export class RolesOnUsersRepository implements IRolesOnUsersRepository {
    constructor(@inject(TYPES.Prisma_Service) private prismaService: PrismaService) {}

    async createRoleOnUser(userId: number, role: Roles): Promise<Role> {
        const { id } = await this.prismaService.dbClient.rolesOnUsers.create({
            data: {
                userId,
                role,
            },
        });

        return new Role(id, userId, role);
    }

    async findRoleOnUser(userId: number): Promise<Role[]> {
        const result = await this.prismaService.dbClient.rolesOnUsers.findMany({
            where: {
                userId,
            },
        });

        const roleArray = result.map(({ id, userId, role }) => {
            return new Role(id, userId, role);
        });

        return roleArray;
    }

    async deleteRoleOnUser(userId: number, role: Roles): Promise<number> {
        const { count } = await this.prismaService.dbClient.rolesOnUsers.deleteMany({
            where: {
                userId,
                role,
            },
        });

        return count;
    }

    async getAll(): Promise<Role[]> {
        const result = await this.prismaService.dbClient.rolesOnUsers.findMany();

        const roleArray = result.map(({ id, userId, role }) => {
            return new Role(id, userId, role);
        });

        return roleArray;
    }
}
