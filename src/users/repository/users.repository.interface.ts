import { User as UserModel } from '@prisma/client';
import { User } from '../user.entity';

export interface IUsersRepository {
    create(user: User): Promise<UserModel>;
    find(email: string): Promise<UserModel | null>;
    update(user: User): Promise<UserModel>;
    delete(user: User): Promise<UserModel>;
}
