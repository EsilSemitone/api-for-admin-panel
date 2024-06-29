import 'reflect-metadata';
import { Prisma, Roles, RolesOnUsers } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../injectsTypes';
import { IRolesOnUsersRepository } from './interfaces/roles.repository.interface';
import { injectable, inject } from 'inversify';

@injectable()
export class RolesOnUsersRepository implements IRolesOnUsersRepository {
    constructor(@inject(TYPES.Prisma_Service) private prismaService: PrismaService) {}

    async createRoleOnUser(userId: number, role: Roles): Promise<RolesOnUsers> {
        return this.prismaService.dbClient.rolesOnUsers.create({
            data: {
                userId,
                role,
            },
        });
    }

    async findRoleOnUser(userId: number): Promise<RolesOnUsers[]> {
        return this.prismaService.dbClient.rolesOnUsers.findMany({
            where: {
                userId,
            },
        });
    }

    async deleteRoleOnUser(userId: number, role: Roles): Promise<Prisma.BatchPayload> {
        return this.prismaService.dbClient.rolesOnUsers.deleteMany({
            where: {
                userId,
                role,
            },
        });
    }

    async getAll(): Promise<RolesOnUsers[]> {
        return this.prismaService.dbClient.rolesOnUsers.findMany();
    }
}
