import { UserChangeDto } from '../dto/users.change.dto';
import { UserDeleteDto } from '../dto/users.delete.dto';
import { UserLoginDto } from '../dto/users.login.dto';
import { UserRegisterDto } from '../dto/users.register.dto';

export interface IUsersService {
    createUser(user: UserRegisterDto): Promise<boolean>;
    validateUser(user: UserLoginDto): Promise<boolean>;
    changeUser(user: UserChangeDto): Promise<boolean>;
    deleteUser(user: UserDeleteDto): Promise<boolean>;
}
