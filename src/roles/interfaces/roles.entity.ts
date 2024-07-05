import { Roles } from '@prisma/client';

export class Role {
    constructor(
        private _id: number,
        private _userId: number,
        private _role: Roles,
    ) {}

    get id(): number {
        return this._id;
    }

    get userId(): number {
        return this._userId;
    }

    get role(): Roles {
        return this._role;
    }
}
