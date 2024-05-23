import 'reflect-metadata';
import { IUsersRepository } from './users.repository.interface';
import { User as UserModel } from '@prisma/client';
import { User } from '../user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../injectsTypes';
import { PrismaService } from '../../database/prisma.service';

@injectable()
export class UserRepository implements IUsersRepository {
    constructor(
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) {}

    async crete({ name, email, password }: User): Promise<UserModel> {
        return this.prismaService.dbClient.user.create({
            data: { name, email, password },
        });
    }

    async find({ email }: User): Promise<UserModel | null> {
        return this.prismaService.dbClient.user.findFirst({
            where: {
                email,
            },
        });
    }

    async update({ name, email, password, role }: User): Promise<UserModel> {
        return this.prismaService.dbClient.user.update({
            where: { email },
            data: {
                name,
                email,
                password,
                role,
            },
        });
    }

    async delete({ email }: User): Promise<UserModel> {
        return this.prismaService.dbClient.user.delete({ where: { email } });
    }
}
