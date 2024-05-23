import { Roles } from '@prisma/client';

export class UserRegisterDto {
    name: string;
    email: string;
    password: string;
    role?: Roles;
}
