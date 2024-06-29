import 'reflect-metadata';
import { Roles } from '@prisma/client';
import { IMiddleware } from './interfaces/middleware.interface';
import { injectable, inject } from 'inversify';
import { TYPES } from '../injectsTypes';
import { IJwtService } from '../jwtService/jwt.service.interface';
import { AuthGuard } from './auth.guard';
import { IAuthGuardFactory } from './interfaces/auth.guard.factory.interface';

@injectable()
export class AuthGuardFactory implements IAuthGuardFactory {
    constructor(@inject(TYPES.Jwt_Service) private jwtService: IJwtService) {}

    create(role: Roles): IMiddleware {
        return new AuthGuard(role, this.jwtService);
    }
}
