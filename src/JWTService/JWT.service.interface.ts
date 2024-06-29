import { Roles } from '@prisma/client';
import { CustomJWTPayload } from './jwt.types';

export interface IJwtService {
    sign(role: Roles[], userId: number): Promise<string>;
    verify(token: string): Promise<CustomJWTPayload>;
}
