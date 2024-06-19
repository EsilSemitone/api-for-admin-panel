import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../../config/config.service.interface';
import { IUsersRepository } from '../repository/users.repository.interface';
import { IRolesOnUsersRepository } from '../../roles/repository/rolesOnUsers.repository.interface';
import { IUsersService } from './users.service.interface';
import { TYPES } from '../../injectsTypes';
import { UsersService } from './users.service';
import { UserRegisterDto } from '../dto/users.register.dto';
import { User } from '../user.entity';
import { User as UserModel } from '@prisma/client';
import { UserLoginDto } from '../dto/users.login.dto';
import { UserUpdateDto } from '../dto/users.update.dto';

const configServiceMock: IConfigService = {
    get: jest.fn(),
};

const usersRepositoryMock: IUsersRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};
const rolesOnUsersRepositoryMock: IRolesOnUsersRepository = {
    createRoleOnUser: jest.fn(),
    findRoleOnUser: jest.fn(),
    deleteRoleOnUser: jest.fn(),
    getAll: jest.fn(),
};

const container = new Container();

let usersService: IUsersService;
let configService: IConfigService;
let usersRepository: IUsersRepository;
let rolesOnUsersRepository: IRolesOnUsersRepository;

//Можно ли как то разбивать тесты чтобы не пимать все в одном файле?
//Или это не хорошоя практика?

const someUserRegister: UserRegisterDto = {
    name: 'User',
    email: 'SomeUser@mail.ru',
    password: 'SomePassword',
};

const foundUser: UserModel = {
    id: 1,
    name: 'User',
    email: 'SomeUser@mail.ru',
    password: '$2a$10$1Whgbh4K3a5dsKryp334YOb1eARjX8z.ylsWBr67erE/w9ZXf462a',
    createdAt: new Date(),
    updatedAt: new Date(),
};

const validUserLogin: UserLoginDto = {
    email: 'SomeUser@mail.ru',
    password: 'Some_Password',
};

const invalidUserLogin: UserLoginDto = {
    email: 'SomeUser@mail.ru',
    password: 'Some_invalid_Password',
};

const validUserUpdateDto: UserUpdateDto = {
    email: 'SomeUser@mail.ru',
    paramName: 'email',
    data: {
        email: 'SomeUser1@mail.ru',
    },
};

const invalidUserUpdateDto: UserUpdateDto = {
    email: 'SomeUser@mail.ru',
    paramName: 'email',
    data: {
        name: 'SomeOtherName',
    },
};

beforeAll(() => {
    container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
    container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(configServiceMock);
    container.bind<IUsersRepository>(TYPES.UserRepository).toConstantValue(usersRepositoryMock);
    container
        .bind<IRolesOnUsersRepository>(TYPES.RolesOnUsersRepository)
        .toConstantValue(rolesOnUsersRepositoryMock);

    usersService = container.get<IUsersService>(TYPES.UsersService);
    configService = container.get<IConfigService>(TYPES.ConfigService);
    usersRepository = container.get<IUsersRepository>(TYPES.UserRepository);
    rolesOnUsersRepository = container.get<IRolesOnUsersRepository>(TYPES.RolesOnUsersRepository);
});

describe('user service', () => {
    it('Create user', async () => {
        let createdUser: UserModel;
        configService.get = jest.fn().mockReturnValue(10);

        usersRepository.create = jest.fn().mockImplementation((user: User) => {
            createdUser = {
                id: 1,
                name: user.name,
                email: user.email,
                password: user._password,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            return createdUser;
        });

        const user = await usersService.createUser(someUserRegister);

        expect(user).toBe(true);
        expect(createdUser!.password).toBeTruthy();
        expect(createdUser!.password).not.toBe('Some_Password');
    });

    it('validate valid user', async () => {
        usersRepository.find = jest.fn().mockReturnValueOnce(foundUser);
        const result = await usersService.validateUser(validUserLogin);
        expect(result).toBe(foundUser);
    });

    it('validate invalid user', async () => {
        usersRepository.find = jest.fn().mockReturnValueOnce(foundUser);
        const result = await usersService.validateUser(invalidUserLogin);
        expect(result).toBe(null);
    });

    it('valid update user', async () => {
        usersRepository.findById = jest.fn().mockReturnValueOnce(foundUser);
        usersRepository.update = jest
            .fn()
            .mockImplementation(async (id: number, user: UserModel) => true);

        const result = await usersService.updateUser(validUserUpdateDto, 1);
        expect(result).not.toBe(null);
    });

    it('invalid update user', async () => {
        usersRepository.findById = jest.fn().mockRejectedValueOnce(foundUser);
        usersRepository.update = jest
            .fn()
            .mockImplementation((id: number, user: UserModel) => true);

        const result = await usersService.updateUser(invalidUserUpdateDto, 1);
        expect(result).toBe(null);
    });
});
