import { App } from '../src/app';
import request from 'supertest';
import { LocalPrismaService, common, endingTest, mainSeed } from './seed';
import { _ADMIN } from './users';

let application: App;
let prismaService: LocalPrismaService;

const userRegisterDtoExist = {
    name: 'USER',
    email: 'USER@mail.ru',
    password: 'USERUSER',
};

const userRegisterDtoNoExist = {
    name: 'USER1',
    email: 'USER1@mail.ru',
    password: 'USER1USER1',
};

beforeAll(async () => {
    const { app, localPrismaService } = await common;
    prismaService = localPrismaService;
    application = app;
    await mainSeed(prismaService);
});

afterEach(async () => {
    await mainSeed(prismaService);
});

describe('users e2e', () => {
    it('Register Error', async () => {
        const res = await request(application.app)
            .post('/users/register')
            .send(userRegisterDtoExist);
        expect(res.statusCode).toBe(422);
    });

    it('Register success', async () => {
        const res = await request(application.app)
            .post('/users/register')
            .send(userRegisterDtoNoExist);
        expect(res.statusCode).toBe(200);
    });

    it('login success', async () => {
        const res = await request(application.app).post('/users/login').send(userRegisterDtoExist);
        expect(res.status).toBe(200);
    });

    it('login error', async () => {
        const res = await request(application.app)
            .post('/users/login')
            .send(userRegisterDtoNoExist);
        expect(res.status).toBe(401);
    });

    it('delete success', async () => {
        const loginUserResponse = await request(application.app)
            .post('/users/login')
            .send(userRegisterDtoExist);

        const token: string = loginUserResponse.body.token;

        const deleteUserResponse = await request(application.app)
            .delete('/users/delete')
            .set({ Authorization: `Bear ${token}` })
            .send({ email: userRegisterDtoExist.email });

        expect(deleteUserResponse.statusCode).toBe(200);
    });

    it('delete error', async () => {
        const res = await request(application.app)
            .delete('/users/delete')
            .send({ email: userRegisterDtoExist.email });
        expect(res.status).toBe(403);
    });

    it('update success', async () => {
        const loginUserResponse = await request(application.app)
            .post('/users/login')
            .send(userRegisterDtoExist);

        const token: string = loginUserResponse.body.token;

        const updateUserResponse = await request(application.app)
            .patch('/users/update')
            .set({ Authorization: `Bear ${token}` })
            .send({
                email: userRegisterDtoExist.email,
                paramName: 'email',
                data: { email: 'NEW_EMAIL@mail.ru' },
            });

        const loginWithNewEmailResponse = await request(application.app)
            .post('/users/login')
            .send({ email: 'NEW_EMAIL@mail.ru', password: userRegisterDtoExist.password });

        expect(updateUserResponse.statusCode).toBe(200);
        expect(loginWithNewEmailResponse.statusCode).toBe(200);
    });

    it('update error', async () => {
        const loginUserResponse = await request(application.app)
            .post('/users/login')
            .send(userRegisterDtoExist);

        const token: string = loginUserResponse.body.token;

        const updateUserResponse = await request(application.app)
            .patch('/users/update')
            .set({ Authorization: `Bear ${token}` })
            .send({
                email: userRegisterDtoExist.email,
                paramName: 'name',
                data: { email: 'NEW_EMAIL@mail.ru' },
            });

        expect(updateUserResponse.statusCode).toBe(404);
    });

    it('appoint role success', async () => {
        const loginAdminResponse = await request(application.app).post('/users/login').send(_ADMIN);

        const token = loginAdminResponse.body.token;

        const appointGeneralWarehouseManResponse = await request(application.app)
            .post(`/admin/appoint`)
            .set({ Authorization: `Bear ${token}` })
            .send({
                email: userRegisterDtoExist.email,
            });

        expect(appointGeneralWarehouseManResponse.statusCode).toBe(200);
    });

    it('appoint role error', async () => {
        const loginAdminResponse = await request(application.app)
            .post('/users/login')
            .send(userRegisterDtoExist);

        const token = loginAdminResponse.body.token;

        const appointGeneralWarehouseManResponse = await request(application.app)
            .post(`/admin/appoint`)
            .set({ Authorization: `Bear ${token}` })
            .send({
                email: userRegisterDtoExist.email,
            });

        expect(appointGeneralWarehouseManResponse.statusCode).toBe(403);
    });

    it('remove role success', async () => {
        const loginAdminResponse = await request(application.app).post('/users/login').send(_ADMIN);

        const token = loginAdminResponse.body.token;

        const removeGeneralWarehouseRoleResponse = await request(application.app)
            .delete('/admin/remove')
            .set({ Authorization: `Bear ${token}` })
            .send({ email: 'GENERAL_WAREHOUS@mail.ru' });

        expect(removeGeneralWarehouseRoleResponse.statusCode).toBe(200);
    });

    it('remove role error', async () => {
        const loginAdminResponse = await request(application.app).post('/users/login').send(_ADMIN);

        const token = loginAdminResponse.body.token;

        const removeGeneralWarehouseRoleResponse = await request(application.app)
            .delete('/admin/remove')
            .set({ Authorization: `Bear ${token}` })
            .send({ email: 'GENERAL_WAREHOUSd_1@mail.ru' });

        expect(removeGeneralWarehouseRoleResponse.statusCode).toBe(404);
    });
});

afterAll(async () => {
    application.close();
    await endingTest(prismaService);
});
