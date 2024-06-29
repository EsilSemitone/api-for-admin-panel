import { Roles } from '@prisma/client';

export enum RequestFields {
    EXIST,
    NOT_EXIST,
}

declare module 'express' {
    export interface Request<T extends RequestFields> {
        id: T extends RequestFields.EXIST ? number : never;
        role: T extends RequestFields.EXIST ? Roles[] : never;
    }

    export interface RolesChangeQueryParams {
        email: string;
        role?: Roles;
    }
}
