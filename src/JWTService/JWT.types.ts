import { Roles } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

export interface CustomJWTPayload extends JwtPayload {
    role: Roles[];
    userId: number;
}
