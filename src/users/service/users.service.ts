import 'reflect-metadata';
import { UserUpdateDto } from '../dto/users.change.dto';
import { UserDeleteDto } from '../dto/users.delete.dto';
import { UserLoginDto } from '../dto/users.login.dto';
import { UserRegisterDto } from '../dto/users.register.dto';
import { User } from '../user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../injectsTypes';
import { ILogger } from '../../logger/logger.service.interface';
import { IConfigService } from '../../config/config.service.interface';
import { IUsersService } from './users.service.interface';
import { IUsersRepository } from '../repository/users.repository.interface';
import { Roles, RolesOnUsers, User as UserModel } from '@prisma/client';
import { IRolesOnUsersRepository } from '../repository/rolesOnUsers.repository.interface';

@injectable()
export class UsersService implements IUsersService {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.UserRepository) private usersRepository: IUsersRepository,
        @inject(TYPES.RolesOnUsersRepository)
        private rolesOnUsersRepository: IRolesOnUsersRepository,
    ) {}

    async getUser(email: string): Promise<UserModel | null> {
        return this.usersRepository.find(email);
    }

    async getRoles(userId: number): Promise<Roles[]> {
        const rolesOnUser = await this.rolesOnUsersRepository.findRoleOnUser(userId);
        const roles = rolesOnUser.map(roleOnUser => roleOnUser.role);
        return roles;
    }

    async createUser({ name, email, password }: UserRegisterDto): Promise<boolean> {
        const isExistUser = await this.usersRepository.find(email);

        if (isExistUser) {
            return false;
        }

        const user = new User(name, email);
        const salt = this.configService.get('SALT');
        await user.setPassword(password, Number(salt));

        await this.usersRepository.create(user);
        return true;
    }

    async validateUser({ email, password }: UserLoginDto): Promise<null | UserModel> {
        const existUserInDB = await this.usersRepository.find(email);

        if (!existUserInDB) {
            return null;
        }

        const user = new User(
            existUserInDB.name,
            existUserInDB.email,
            existUserInDB.password,
        );

        const isValidePassword = await user.validatePassword(password);

        if (!isValidePassword) {
            return null;
        }

        return existUserInDB;
    }

    changeUser(user: UserUpdateDto): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    deleteUser(user: UserDeleteDto): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}
