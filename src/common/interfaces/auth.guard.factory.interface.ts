import { Roles } from '@prisma/client';
import { IMiddleware } from './middleware.interface';

export interface IAuthGuardFactory {
    create(role: Roles): IMiddleware;
}
