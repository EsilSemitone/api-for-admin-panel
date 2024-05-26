import { JwtPayload } from 'jsonwebtoken';

export interface IJWTService {
    sign(email: string): Promise<string>;
    verify(token: string): Promise<JwtPayload>;
}
