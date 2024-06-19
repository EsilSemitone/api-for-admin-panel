import 'reflect-metadata';
import { UserUpdateDto, UserUpdateDtoParamsTypes } from '../dto/users.update.dto';
import { UserLoginDto } from '../dto/users.login.dto';
import { UserRegisterDto } from '../dto/users.register.dto';
import { User } from '../user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../injectsTypes';
import { IConfigService } from '../../config/config.service.interface';
import { IUsersService } from './users.service.interface';
import { IUsersRepository } from '../repository/users.repository.interface';
import { User as UserModel } from '@prisma/client';
import { IRolesOnUsersRepository } from '../../roles/repository/rolesOnUsers.repository.interface';

@injectable()
export class UsersService implements IUsersService {
    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.UserRepository) private usersRepository: IUsersRepository,
        @inject(TYPES.RolesOnUsersRepository)
        private rolesOnUsersRepository: IRolesOnUsersRepository,
    ) {}

    async getUser(email: string): Promise<UserModel | null> {
        return this.usersRepository.find(email);
    }

    async getUserById(id: number): Promise<UserModel | null> {
        return this.usersRepository.findById(id);
    }

    async createUser({ name, email, password }: UserRegisterDto): Promise<boolean> {
        const isExistUser = await this.usersRepository.find(email);

        if (isExistUser) {
            return false;
        }

        const user = new User(name, email);
        const salt = this.configService.get('SALT');
        await user.setPassword(password, Number(salt));

        const createdUser = await this.usersRepository.create(user);
        const { id } = createdUser;

        //Почему в такой записи тест будет провален?
        // const { id } = await this.usersRepository.create(user);
        //TypeError: Cannot destructure property 'id' of '(intermediate value)' as it is undefined.

        this.rolesOnUsersRepository.createRoleOnUser(id, 'USER');

        return true;
    }

    async validateUser({ email, password }: UserLoginDto): Promise<null | UserModel> {
        const existUserInDB = await this.usersRepository.find(email);

        if (!existUserInDB) {
            return null;
        }

        const user = new User(existUserInDB.name, existUserInDB.email, existUserInDB.password);

        const isValidePassword = await user.validatePassword(password);

        if (!isValidePassword) {
            return null;
        }

        return existUserInDB;
    }

    async updateUser(
        { paramName, data }: UserUpdateDto,
        userId: number,
    ): Promise<UserModel | null> {
        const validParam = data[paramName];

        if (!validParam) {
            return null;
        }

        const existUserInDB = await this.usersRepository.findById(userId);

        if (!existUserInDB) {
            return null;
        }
        existUserInDB[paramName] = data[paramName] as string;

        const updatedUser = await this.usersRepository.update(userId, existUserInDB);

        return updatedUser;
    }

    async deleteUser(id: number): Promise<UserModel> {
        return this.usersRepository.delete(id);
    }
}
