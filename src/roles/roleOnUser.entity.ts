import { RolesType } from './roles';

export class RoleOnUser {
    constructor(
        private _id: number,
        private _userId: number,
        private _role: RolesType,
    ) {}

    get id(): number {
        return this._id;
    }

    get userId(): number {
        return this._userId;
    }

    get role(): RolesType {
        return this._role;
    }
}
