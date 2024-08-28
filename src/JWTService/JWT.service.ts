import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TYPES } from '../injectsTypes';
import { IConfigService } from '../config/config.service.interface';
import { sign, verify as jwtVerify } from 'jsonwebtoken';
import { IJwtService } from './jwt.service.interface';
import { CustomJWTPayload } from './jwt.types';
import { RolesType } from '../roles/roles';

@injectable()
export class JWTService implements IJwtService {
    secret: string;

    constructor(@inject(TYPES.configService) private configService: IConfigService) {
        this.secret = this.configService.get('SECRET');
    }

    async sign(role: RolesType[], userId: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            sign(
                {
                    role,
                    userId,
                    iat: Math.floor(Date.now() / 1000),
                },
                this.secret,
                { algorithm: 'HS256' },
                (error, encoded) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(encoded as string);
                },
            );
        });
    }

    verify(token: string): Promise<CustomJWTPayload> {
        return new Promise<CustomJWTPayload>((resolve, reject) => {
            jwtVerify(token, this.secret, (error, decoder) => {
                if (error) {
                    reject(error);
                }
                resolve(decoder as CustomJWTPayload);
            });
        });
    }
}
