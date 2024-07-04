import { UserLoginDto } from '../dto/users.login.dto';
import { UserRegisterDto } from '../dto/users.register.dto';
import { UserUpdateDto } from '../dto/users.update.dto';
import { User } from '../user.entity';

export interface IUsersService {
    getUser(email: string): Promise<User | null>;
    getUserById(id: number): Promise<User | null>;
    createUser(user: UserRegisterDto): Promise<boolean>;
    validateUser(user: UserLoginDto): Promise<null | User>;
    updateUser(dto: UserUpdateDto, userId: number): Promise<User | null>;
    deleteUser(id: number): Promise<User>;
}
