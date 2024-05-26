import { Roles } from '@prisma/client';
import { hash, compare } from 'bcryptjs';

export class User {
    _password: string;
    _role: Roles[] = ['USER'];

    constructor(
        private readonly _name: string,
        private readonly _email: string,
        password?: string,
    ) {}

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get password(): string {
        return this._password;
    }

    get role(): Roles[] {
        return this._role;
    }

    async setPassword(password: string, salt: string): Promise<void> {
        this._password = await hash(password, salt);
    }

    async validatePassword(password: string): Promise<boolean> {
        return compare(password, this._password);
    }

    setRole(role: Roles[]): void {
        this._role = role;
    }
}
