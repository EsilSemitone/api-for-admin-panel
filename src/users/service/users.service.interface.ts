import { Roles, User as UserModel } from '@prisma/client';
import { UserChangeDto } from '../dto/users.change.dto';
import { UserDeleteDto } from '../dto/users.delete.dto';
import { UserLoginDto } from '../dto/users.login.dto';
import { UserRegisterDto } from '../dto/users.register.dto';

export interface IUsersService {
    getUser(email: string): Promise<UserModel | null>;
    getRoles(userId: number): Promise<Roles[]>;
    createUser(user: UserRegisterDto): Promise<boolean>;
    validateUser(user: UserLoginDto): Promise<null | UserModel>;
    changeUser(user: UserChangeDto): Promise<boolean>;
    deleteUser(user: UserDeleteDto): Promise<boolean>;
}
