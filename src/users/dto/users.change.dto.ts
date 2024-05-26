import { Roles } from '@prisma/client';
import { IsEmail, IsString, Length } from 'class-validator';

export class UserChangeDto {
    @Length(3, 20)
    @IsString()
    name?: string;

    @IsEmail()
    @IsString()
    email?: string;

    @Length(8)
    @IsString()
    password?: string;

    role?: Roles;
}
