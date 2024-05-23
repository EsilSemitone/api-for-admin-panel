import { Roles } from '@prisma/client';

export class UserChangeDto {
    name?: string;
    email?: string;
    password?: string;
    role?: Roles;
}
