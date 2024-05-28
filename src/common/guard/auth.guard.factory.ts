import 'reflect-metadata';
import { Roles } from '@prisma/client';
import { IMiddleware } from '../middleware/middleware.interface';
import { IAuthGuardFactory } from './auth.guard.factory.interface';
import { inject, injectable } from 'inversify';
import { IJWTService } from '../../JWTService/JWT.service.interface';
import { AuthGuard } from './auth.guard';
import { TYPES } from '../../injectsTypes';

@injectable()
export class AuthGuardFactory implements IAuthGuardFactory {
    constructor(@inject(TYPES.JWTService) private jwtService: IJWTService) {}

    create(role: Roles): IMiddleware {
        return new AuthGuard(role, this.jwtService);
    }
}
