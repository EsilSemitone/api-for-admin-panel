import { User } from '../user.entity';

export interface IUsersRepository {
    create(user: User): Promise<User>;
    find(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    update(id: number, user: User): Promise<User>;
    delete(id: number): Promise<User>;
}
