import { User as UserModel } from '@prisma/client';
import { User } from '../user.entity';

export interface IUsersRepository {
    crete(user: User): Promise<UserModel>;
    find(user: User): Promise<UserModel | null>;
    update(user: User): Promise<UserModel>;
    delete(user: User): Promise<UserModel>;
}
