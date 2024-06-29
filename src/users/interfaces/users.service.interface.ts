import { User as UserModel } from '@prisma/client';
import { UserLoginDto } from '../dto/users.login.dto';
import { UserRegisterDto } from '../dto/users.register.dto';
import { UserUpdateDto } from '../dto/users.update.dto';

export interface IUsersService {
    getUser(email: string): Promise<UserModel | null>;
    getUserById(id: number): Promise<UserModel | null>;
    createUser(user: UserRegisterDto): Promise<boolean>;
    validateUser(user: UserLoginDto): Promise<null | UserModel>;
    updateUser(dto: UserUpdateDto, userId: number): Promise<UserModel | null>;
    deleteUser(id: number): Promise<UserModel>;
}
