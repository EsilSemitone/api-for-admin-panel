import { hash, compare } from 'bcryptjs';
import { RolesType } from '../roles/roles';

export class User {
    _password: string;
    _roles: RolesType[] = ['USER'];
    _id: number;

    constructor(
        private _name: string,
        private _email: string,
        _password?: string,
        _id?: number,
    ) {
        if (_password) {
            this._password = _password;
        }

        if (_id) {
            this._id = _id;
        }
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get email(): string {
        return this._email;
    }

    set email(email: string) {
        this._email = email;
    }

    get password(): string {
        return this._password;
    }

    set password(password: string) {
        this._password = password;
    }

    get role(): RolesType[] {
        return this._roles;
    }

    get id(): number {
        return this._id;
    }

    async setPassword(password: string, salt: number): Promise<void> {
        this._password = await hash(password, salt);
    }

    async validatePassword(password: string): Promise<boolean> {
        const isValidPassword = await compare(password, this._password);
        return isValidPassword;
    }

    setRole(role: RolesType[]): void {
        this._roles = role;
    }
}
