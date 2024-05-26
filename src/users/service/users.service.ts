import 'reflect-metadata';
import { UserChangeDto } from '../dto/users.change.dto';
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

@injectable()
export class UsersService implements IUsersService {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.UserRepository) private usersRepository: IUsersRepository,
    ) {}

    async createUser({
        name,
        email,
        password,
    }: UserRegisterDto): Promise<boolean> {
        const user = new User(name, email);
        const salt = this.configService.get('SALT');
        await user.setPassword(password, salt);
        const isExistUser = await this.usersRepository.find(user);

        if (isExistUser) {
            return true;
        }

        return false;
    }

    async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
        const existUserInDB = await this.usersRepository.find(email);

        if (!existUserInDB) {
            return false;
        }

        const user = new User(
            existUserInDB.name,
            existUserInDB.email,
            existUserInDB.password,
        );
    }
    changeUser(user: UserChangeDto): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    deleteUser(user: UserDeleteDto): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}
