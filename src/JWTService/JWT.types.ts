import { JwtPayload } from 'jsonwebtoken';
import { RolesType } from '../roles/roles';

export interface CustomJWTPayload extends JwtPayload {
    role: RolesType[];
    userId: number;
}
