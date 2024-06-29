import { Roles } from '@prisma/client';

export enum RequestFields {
    ID,
    ROLE,
    NONE,
}

declare module 'express' {
    export interface Request<T extends RequestFields> {
        id: T extends RequestFields.ID ? number : never;
        role: T extends RequestFields.ROLE ? Roles[] : never;
    }

    export interface RolesChangeQueryParams {
        email: string;
        role?: Roles;
    }
}
