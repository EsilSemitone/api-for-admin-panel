import { Roles } from '@prisma/client';

declare module 'express' {
    export interface Request {
        id?: number;
        role?: Roles[];
        rolesChangeQueryParams?: RolesChangeQueryParams;
    }

    export interface RolesChangeQueryParams {
        email: string;
        role?: Roles;
    }
}
