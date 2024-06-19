import { PrismaClient, Roles } from '@prisma/client';
import { User } from '../users/user.entity';
import { hashSync } from 'bcryptjs';
import { DotenvParseOutput, config } from 'dotenv';

const SALT = Number(initConfig()['SALT']);

type StandartUsersSeed = {
    ADMIN: User;
    USER: User;
    GENERAL_WAREHOUS: User;
};

function initConfig(): DotenvParseOutput {
    const { error, parsed } = config();

    if (error) {
        throw new Error('Не получилось спарсить .env файл');
    }
    return parsed as DotenvParseOutput;
}

function createUsers(): StandartUsersSeed {
    const ADMIN = new User('ADMIN', 'ADMIN@mail.ru', hashSync('ADMINADMIN', SALT));
    const USER = new User('USER', 'USER@mail.ru', hashSync('USERUSER', SALT));
    const GENERAL_WAREHOUS = new User(
        'GENERAL_WAREHOUS',
        'GENERAL_WAREHOUS@mail.ru',
        hashSync('GENERAL_WAREHOUS', SALT),
    );

    return {
        ADMIN,
        USER,
        GENERAL_WAREHOUS,
    };
}

export class LocalPrismaService {
    db: PrismaClient;
    constructor() {
        this.db = new PrismaClient();
        this.connect();
    }

    connect(): void {
        this.db.$connect();
    }

    disconnect(): void {
        this.db.$disconnect();
    }

    async setUser({ name, email, password }: User, role: Roles): Promise<void> {
        const { id } = await this.db.user.create({
            data: {
                name,
                email,
                password,
            },
        });

        await this.db.rolesOnUsers.create({
            data: {
                userId: id,
                role,
            },
        });
    }

    async clear(): Promise<void> {
        await this.db.user.deleteMany();
        await this.db.rolesOnUsers.deleteMany();
    }
}

export async function mainSeed(prismaService: LocalPrismaService): Promise<void> {
    prismaService.connect();
    await prismaService.clear();

    const { USER, ADMIN, GENERAL_WAREHOUS } = createUsers();
    await prismaService.setUser(USER, 'USER');
    await prismaService.setUser(ADMIN, 'ADMIN');
    await prismaService.setUser(GENERAL_WAREHOUS, 'GENERAL_WAREHOUS');
    prismaService.disconnect();
}

export async function endingTest(): Promise<void> {
    const prismaService = new LocalPrismaService();
    await prismaService.clear();
    prismaService.disconnect();
}
