import 'reflect-metadata';
import { IMiddleware } from './interfaces/middleware.interface';
import { injectable, inject } from 'inversify';
import { TYPES } from '../injectsTypes';
import { IJwtService } from '../jwtService/jwt.service.interface';
import { AuthGuard } from './auth.guard';
import { IAuthGuardFactory } from './interfaces/auth.guard.factory.interface';
import { RolesType } from '../roles/roles';

@injectable()
export class AuthGuardFactory implements IAuthGuardFactory {
    constructor(@inject(TYPES.jwtService) private jwtService: IJwtService) {}

    create(role: RolesType[]): IMiddleware {
        return new AuthGuard(role, this.jwtService);
    }
}
