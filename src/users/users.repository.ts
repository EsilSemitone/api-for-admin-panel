import 'reflect-metadata';
import { IUsersRepository } from './interfaces/users.repository.interface';
import { User } from './user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../injectsTypes';
import { PrismaService } from '../database/prisma.service';

@injectable()
export class UserRepository implements IUsersRepository {
    constructor(@inject(TYPES.Prisma_Service) private prismaService: PrismaService) {}

    async create({ name, email, password }: User): Promise<User> {
        const { id } = await this.prismaService.dbClient.user.create({
            data: { name, email, password },
        });
        const createdUser = new User(name, email, password, id);
        return createdUser;
    }

    async find(email: string): Promise<User | null> {
        const result = await this.prismaService.dbClient.user.findFirst({
            where: {
                email,
            },
        });

        if (!result) {
            return null;
        }

        const { name, password, id } = result;

        return new User(name, email, password, id);
    }

    async findById(id: number): Promise<User | null> {
        const result = await this.prismaService.dbClient.user.findFirst({
            where: {
                id,
            },
        });

        if (!result) {
            return null;
        }

        const { name, email, password } = result;

        return new User(name, email, password, id);
    }

    async update(id: number, { name, email, password }: User): Promise<User> {
        const result = await this.prismaService.dbClient.user.update({
            where: { id },
            data: {
                name,
                email,
                password,
            },
        });
        return new User(result.name, result.email, result.password, id);
    }

    async delete(id: number): Promise<User> {
        const { name, email, password } = await this.prismaService.dbClient.user.delete({
            where: { id },
        });
        return new User(name, email, password, id);
    }
}
