import { IsEmail } from 'class-validator';

export class AppointRoleDto {
    @IsEmail({}, { message: 'Передан не email' })
    email: string;
}
