import 'reflect-metadata';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../injectsTypes';
import { IRolesOnUsersRepository } from './interfaces/roles.repository.interface';
import { injectable, inject } from 'inversify';
import { RoleOnUser } from './roleOnUser.entity';
import { isRoleType, RolesType } from './roles';

@injectable()
export class RolesOnUsersRepository implements IRolesOnUsersRepository {
    constructor(@inject(TYPES.prismaService) private prismaService: PrismaService) {}

    async createRoleOnUser(userId: number, role: RolesType): Promise<RoleOnUser> {
        const { id } = await this.prismaService.dbClient.rolesOnUsers.create({
            data: {
                userId,
                role,
            },
        });

        return new RoleOnUser(id, userId, role);
    }

    async findRoleOnUser(userId: number): Promise<RoleOnUser[]> {
        const result = await this.prismaService.dbClient.rolesOnUsers.findMany({
            where: {
                userId,
            },
        });

        const roleArray = result
            .map(({ id, userId, role }) => {
                if (isRoleType(role)) {
                    return new RoleOnUser(id, userId, role);
                }
            })
            .filter(obj => obj !== undefined);
        //Странный баг, тип переменной roleArray => RoleOnUser[]
        //Но когда я запускаю тесты то TypeScript ругается что тип (RoleOnUser | undefined)[]
        return roleArray as RoleOnUser[];
    }

    async deleteRoleOnUser(userId: number, role: RolesType): Promise<number> {
        const { count } = await this.prismaService.dbClient.rolesOnUsers.deleteMany({
            where: {
                userId,
                role,
            },
        });

        return count;
    }

    async getAll(): Promise<RoleOnUser[]> {
        const result = await this.prismaService.dbClient.rolesOnUsers.findMany();

        const rolesArray = result
            .map(({ id, userId, role }) => {
                if (isRoleType(role)) {
                    return new RoleOnUser(id, userId, role);
                }
            })
            .filter(obj => obj !== undefined);

        return rolesArray as RoleOnUser[];
    }
}
