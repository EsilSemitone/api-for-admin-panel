import { Roles } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import { CustomJWTPayload } from './JWT.types';

export interface IJWTService {
    sign(role: Roles[]): Promise<string>;
    verify(token: string): Promise<CustomJWTPayload>;
}
