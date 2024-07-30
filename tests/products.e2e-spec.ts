import { common, endingTest, LocalPrismaService, mainSeed } from './seed';
import { App } from '../src/app';
import request, { Response, Test } from 'supertest';
import { _ADMIN, _GENERAL_WAREHOUSE, _USER } from './users';
import { UserLoginDto } from '../src/users/dto/users.login.dto';
import TestAgent from 'supertest/lib/agent';

let application: App;
let prismaService: LocalPrismaService;

const AMOUNT_ALL_PRODUCTS = 10;
const AMOUNT_ALL_PRODUCTS_OF_STOCK = 9;
const NOT_EXIST_PRODUCT_ID = 999999;

type ThreeRoleUserType<T> = [T, T, T];

beforeAll(async () => {
    const { app, localPrismaService } = await common;
    prismaService = localPrismaService;
    application = app;
    await mainSeed(prismaService);
});

afterEach(async () => {
    await mainSeed(prismaService);
});

async function login(dto: UserLoginDto): Promise<Response> {
    return request(application.app).post('/users/login').send(dto);
}

async function loginByRoles(
    dtoArray: ThreeRoleUserType<UserLoginDto>,
): Promise<ThreeRoleUserType<string>> {
    const responses = await Promise.all(
        dtoArray.map(dto => {
            return login(dto);
        }),
    );

    const tokens = responses.map<string | undefined>(response => {
        return response.body.token;
    });

    return tokens as ThreeRoleUserType<string>;
}

async function getResponses(
    path: string,
    method: keyof Pick<TestAgent, 'post' | 'get' | 'put' | 'delete' | 'patch'>,
    data: string | object,
    query?: Object,
): Promise<ThreeRoleUserType<Response>> {
    const tokens = await loginByRoles([_ADMIN, _GENERAL_WAREHOUSE, _USER]);

    const responses = await Promise.all(
        tokens.map(token => {
            const constructRequest = request(application.app)
                [method](path)
                .set({ Authorization: `Bearer ${token}` })
                .send(data);

            if (query) {
                constructRequest.query(query);
            }
            return constructRequest;
        }),
    );

    return responses as ThreeRoleUserType<Response>;
}

describe('products e2e', () => {
    it('Get all products [Admin]', async () => {
        const [adminResponse, generalWarehouseResponse, userResponse] = await getResponses(
            '/products',
            'get',
            {},
        );

        expect(JSON.parse(adminResponse.text).length).toBe(AMOUNT_ALL_PRODUCTS);
        expect(generalWarehouseResponse.statusCode).toBe(403);
        expect(userResponse.statusCode).toBe(403);
    });

    it('Get all products by filter [Admin, General warehouse]', async () => {
        const [adminResponse, generalWarehouseResponse, userResponse] = await getResponses(
            '/products',
            'get',
            {},
            { type: 'ALCOHOL', price: { from: 210 } },
        );
        expect(JSON.parse(adminResponse.text).length).toBe(1);
        expect(generalWarehouseResponse.statusCode).toBe(403);
        expect(userResponse.statusCode).toBe(403);
    });

    it('Get products of stock [Admin, General warehouse]', async () => {
        const [adminResponse, generalWarehouseResponse, userResponse] = await getResponses(
            '/products/stock',
            'get',
            {},
        );

        expect(adminResponse.statusCode).toBe(403);
        expect(JSON.parse(generalWarehouseResponse.text).length).toBe(AMOUNT_ALL_PRODUCTS_OF_STOCK);
        expect(userResponse.statusCode).toBe(403);
    });

    it('Add products of stock [Admin, General warehouse]', async () => {
        const existProduct = await prismaService.getProductByTitle('book');
        const existProductId = existProduct?.id as number;
        const productIsNotExistByStock = await prismaService.getProductByTitle('ring');
        const productIsNotExistByStockId = productIsNotExistByStock?.id as number;

        const [adminResponse, generalWarehouseResponse, userResponse] = await getResponses(
            '/products/add',
            'post',
            { productId: existProductId, amount: 1 },
        );
        expect(adminResponse.statusCode).toBe(403);
        expect(JSON.parse(generalWarehouseResponse.text)._amount).toBe(11);
        expect(userResponse.statusCode).toBe(403);

        const [adminResponse2, generalWarehouseResponse2, userResponse2] = await getResponses(
            '/products/add',
            'post',
            { productId: productIsNotExistByStockId, amount: 1 },
        );

        expect(adminResponse2.statusCode).toBe(403);
        expect(JSON.parse(generalWarehouseResponse2.text)._amount).toBe(1);
        expect(userResponse2.statusCode).toBe(403);
    });

    it('Add not exist product of stock [Admin, General warehouse]', async () => {
        const [adminResponse, generalWarehouseResponse, userResponse] = await getResponses(
            '/products/add',
            'post',
            { productId: NOT_EXIST_PRODUCT_ID, amount: 1 },
        );

        expect(adminResponse.statusCode).toBe(403);
        expect(generalWarehouseResponse.statusCode).toBe(404);
        expect(userResponse.statusCode).toBe(403);
    });

    it('create product', async () => {
        const [adminResponse, generalWarehouseResponse, userResponse] = await getResponses(
            '/products/create',
            'post',
            { title: 'keyboard', description: 'for PC', price: 5900, type: 'OFFICE' },
        );

        expect(JSON.parse(adminResponse.text)._title).toBe('keyboard');
        expect(generalWarehouseResponse.statusCode).toBe(403);
        expect(userResponse.statusCode).toBe(403);
    });

    it('create exist product', async () => {
        const [adminResponse, generalWarehouseResponse, userResponse] = await getResponses(
            '/products/create',
            'post',
            { title: 'book', description: 'history book', price: 99, type: 'OFFICE' },
        );

        expect(adminResponse.statusCode).toBe(400);
        expect(generalWarehouseResponse.statusCode).toBe(403);
        expect(userResponse.statusCode).toBe(403);
    });

    it('delete exist product', async () => {
        const [adminResponse, generalWarehouseResponse, userResponse] = await getResponses(
            '/products/delete',
            'delete',
            { title: 'book' },
        );

        expect(adminResponse.statusCode).toBe(200);
        expect(generalWarehouseResponse.statusCode).toBe(403);
        expect(userResponse.statusCode).toBe(403);
    });

    it('delete not exist product', async () => {
        const [adminResponse, generalWarehouseResponse, userResponse] = await getResponses(
            '/products/delete',
            'delete',
            { title: 'brilliant ring' },
        );

        expect(adminResponse.statusCode).toBe(404);
        expect(generalWarehouseResponse.statusCode).toBe(403);
        expect(userResponse.statusCode).toBe(403);
    });

    it('update exist product', async () => {
        const existProduct = await prismaService.getProductByTitle('book');
        const existProductId = existProduct?.id as number;

        const [adminResponse, generalWarehouseResponse, userResponse] = await getResponses(
            '/products/update',
            'patch',
            {
                id: existProductId,
                title: 'new title',
                description: 'new description',
                price: 999,
                type: 'FURNITURE',
            },
        );

        expect(JSON.parse(adminResponse.text)._title).toBe('new title');
        expect(JSON.parse(adminResponse.text)._description).toBe('new description');
        expect(JSON.parse(adminResponse.text)._price).toBe(999);
        expect(JSON.parse(adminResponse.text)._type).toBe('FURNITURE');

        expect(generalWarehouseResponse.statusCode).toBe(403);
        expect(userResponse.statusCode).toBe(403);
    });

    it('update not exist product', async () => {
        const [adminResponse, generalWarehouseResponse, userResponse] = await getResponses(
            '/products/update',
            'patch',
            {
                id: NOT_EXIST_PRODUCT_ID,
                title: 'new title',
                description: 'new description',
                price: 999,
                type: 'FURNITURE',
            },
        );

        expect(adminResponse.statusCode).toBe(404);
        expect(generalWarehouseResponse.statusCode).toBe(403);
        expect(userResponse.statusCode).toBe(403);
    });

    it('update product wrong dto', async () => {
        const existProduct = await prismaService.getProductByTitle('book');
        const existProductId = existProduct?.id as number;

        const [adminResponse, generalWarehouseResponse, userResponse] = await getResponses(
            '/products/update',
            'patch',
            { id: existProductId },
        );

        expect(adminResponse.statusCode).toBe(400);
        expect(generalWarehouseResponse.statusCode).toBe(403);
        expect(userResponse.statusCode).toBe(403);
    });
});

afterAll(async () => {
    application.close();
    await endingTest(prismaService);
});
