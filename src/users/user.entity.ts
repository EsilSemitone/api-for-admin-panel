import { Roles } from '@prisma/client';
import { hash, compare } from 'bcryptjs';

export class User {
    _password: string;
    _roles: Roles[] = ['USER'];

    constructor(
        private readonly _name: string,
        private readonly _email: string,
        _password?: string,
    ) {
        if (_password) {
            this._password = _password;
        }
    }

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
        return this._roles;
    }

    async setPassword(password: string, salt: number): Promise<void> {
        this._password = await hash(password, salt);
    }

    async validatePassword(password: string): Promise<boolean> {
        const isValidPassword = await compare(password, this._password);
        return isValidPassword;
    }

    setRole(role: Roles[]): void {
        this._roles = role;
    }
}
