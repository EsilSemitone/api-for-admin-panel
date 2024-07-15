import { CustomJWTPayload } from './jwt.types';
import { RolesType } from '../roles/roles';

export interface IJwtService {
    sign(role: RolesType[], userId: number): Promise<string>;
    verify(token: string): Promise<CustomJWTPayload>;
}
