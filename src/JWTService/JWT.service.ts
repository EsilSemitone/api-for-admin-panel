import 'reflect-metadata';
import { IJWTService } from './JWT.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../injectsTypes';
import { IConfigService } from '../config/config.service.interface';
import { sign, verify as jwtVerify, JwtPayload } from 'jsonwebtoken';

@injectable()
export class JWTService implements IJWTService {
    secret: string;

    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
    ) {
        this.secret = this.configService.get('SECRET');
    }

    async sign(email: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            sign(
                {
                    email,
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

    verify(token: string): Promise<JwtPayload> {
        return new Promise<JwtPayload>((resolve, reject) => {
            jwtVerify(token, this.secret, (error, decoder) => {
                if (error) {
                    reject(error);
                }
                resolve(decoder as JwtPayload);
            });
        });
    }
}
