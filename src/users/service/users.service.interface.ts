import { Roles, User as UserModel } from '@prisma/client';
import { UserLoginDto } from '../dto/users.login.dto';
import { UserRegisterDto } from '../dto/users.register.dto';
import { UserUpdateDto } from '../dto/users.update.dto';

export interface IUsersService {
    getUser(email: string): Promise<UserModel | null>;
    getRoles(userId: number): Promise<Roles[]>;
    createUser(user: UserRegisterDto): Promise<boolean>;
    validateUser(user: UserLoginDto): Promise<null | UserModel>;
    changeUser(user: UserUpdateDto): Promise<boolean>;
    deleteUser(email: string): Promise<UserModel>;
}
