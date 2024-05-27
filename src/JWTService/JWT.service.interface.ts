import { Roles } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

export interface IJWTService {
    sign(role: Roles[]): Promise<string>;
    verify(token: string): Promise<JwtPayload>;
}
