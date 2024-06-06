import { User as UserModel } from '@prisma/client';
import { User } from '../user.entity';
import { DataUpdate, UserUpdateDtoParamsTypes } from '../dto/users.update.dto';

export interface IUsersRepository {
    create(user: User): Promise<UserModel>;
    find(email: string): Promise<UserModel | null>;
    findById(id: number): Promise<UserModel | null>;
    update(id: number, user: UserModel): Promise<UserModel>;
    delete(id: number): Promise<UserModel>;
}
