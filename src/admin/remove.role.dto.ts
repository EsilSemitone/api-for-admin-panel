import { IsEmail } from 'class-validator';

export class RemoveRoleDto {
    @IsEmail({}, { message: 'Передан не email' })
    email: string;
}
