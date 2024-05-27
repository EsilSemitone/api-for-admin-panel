import 'reflect-metadata';
import { Roles, RolesOnUsers } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { TYPES } from '../../injectsTypes';
import { IRolesOnUsersRepository } from './rolesOnUsers.repository.interface';
import { injectable, inject } from 'inversify';

@injectable()
export class RolesOnUsersRepository implements IRolesOnUsersRepository {
    constructor(
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) {}

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
}
