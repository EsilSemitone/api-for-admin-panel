import { PrismaClient } from '@prisma/client';
import { User } from '../src/users/user.entity';
import { hashSync } from 'bcryptjs';
import { DotenvParseOutput, config } from 'dotenv';
import { RolesType } from '../src/roles/roles';
import { ProductsType } from '../src/products/products.types';
import { _ADMIN, _GENERAL_WAREHOUSE, _USER } from './users';
import { App } from '../src/app';
import { box } from '../src/main';
import { Product } from '../src/products/entity/product.entity';

const SALT = Number(initConfig()['SALT']);

type CommonTestReturnType = { app: App; localPrismaService: LocalPrismaService };

type StandardUsersSeed = {
    ADMIN: User;
    USER: User;
    GENERAL_WAREHOUSE: User;
};

type setProductsParamType = {
    title: string;
    description: string;
    price: number;
    type: ProductsType;
};

const products: [setProductsParamType, number?][] = [
    [{ title: 'book', description: 'history book', price: 99, type: 'OFFICE' }, 10],
    [{ title: 'journal', description: 'some journal', price: 199, type: 'OFFICE' }, 23],
    [{ title: 'beer', description: 'north beer', price: 200, type: 'ALCOHOL' }, 30],
    [{ title: 'banana beer', description: 'some beer', price: 299, type: 'ALCOHOL' }, 30],
    [{ title: 'ring', description: 'gold ring', price: 19990, type: 'BIJOUTERIE' }],
    [{ title: 'toy', description: 'some toy', price: 900, type: 'FOR_KIDS' }, 49],
    [{ title: 'big toy', description: 'pink bear', price: 1990, type: 'FOR_KIDS' }, 8],
    [{ title: 'kat food', description: 'beef', price: 99, type: 'FOR_PETS' }, 374],
    [{ title: 'kat toy', description: 'pork', price: 369, type: 'FOR_PETS' }, 17],
    [{ title: 'creme', description: 'for face', price: 790, type: 'COSMETICS' }, 328],
];

function initConfig(): DotenvParseOutput {
    const { error, parsed } = config();

    if (error) {
        throw new Error('Не получилось спарсить .env файл');
    }
    return parsed as DotenvParseOutput;
}

function createUsers(): StandardUsersSeed {
    const ADMIN = new User(_ADMIN.name, _ADMIN.email, hashSync(_ADMIN.password, SALT));
    const USER = new User(_USER.name, _USER.email, hashSync(_USER.password, SALT));
    const GENERAL_WAREHOUSE = new User(
        _GENERAL_WAREHOUSE.name,
        _GENERAL_WAREHOUSE.email,
        hashSync(_GENERAL_WAREHOUSE.password, SALT),
    );

    return {
        ADMIN,
        USER,
        GENERAL_WAREHOUSE,
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

    async setUser({ name, email, password }: User, role: RolesType): Promise<void> {
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
        await Promise.all([
            this.db.user.deleteMany(),
            this.db.rolesOnUsers.deleteMany(),
            this.db.product.deleteMany(),
        ]);
    }

    async setProduct(
        { title, description, price, type }: setProductsParamType,
        amount?: number,
    ): Promise<void> {
        const { id } = await this.db.product.create({
            data: {
                title,
                description,
                price,
                type,
            },
        });

        if (amount) {
            await this.db.stock.create({
                data: {
                    productId: id,
                    amount,
                },
            });
        }
    }

    async getProductByTitle(title: string): Promise<Product | null> {
        const result = await this.db.product.findFirst({ where: { title } });
        if (!result) {
            return null;
        }

        const { id, description, price, type, createdAt, updatedAt } = result;

        return new Product(
            id,
            title,
            description,
            price,
            type as ProductsType,
            createdAt,
            updatedAt,
        );
    }
}

export async function mainSeed(prismaService: LocalPrismaService): Promise<void> {
    prismaService.connect();
    await prismaService.clear();

    const { USER, ADMIN, GENERAL_WAREHOUSE } = createUsers();
    await Promise.all([
        prismaService.setUser(USER, 'USER'),
        prismaService.setUser(ADMIN, 'ADMIN'),
        prismaService.setUser(GENERAL_WAREHOUSE, 'GENERAL_WAREHOUSE'),
    ]);
    await setProducts(prismaService, products);
    prismaService.disconnect();
}

async function setProducts(
    prismaService: LocalPrismaService,
    products: [setProductsParamType, number?][],
): Promise<void> {
    await Promise.all(
        products.map(([data, amount]) => {
            return prismaService.setProduct(data, amount);
        }),
    );
}

export async function endingTest(prismaService: LocalPrismaService): Promise<void> {
    prismaService.connect();
    await prismaService.clear();
    prismaService.disconnect();
}

async function commonTest(): Promise<CommonTestReturnType> {
    const { app } = await box;
    const localPrismaService = new LocalPrismaService();
    return { app, localPrismaService };
}

export const common = commonTest();
