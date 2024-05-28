import { Roles } from '@prisma/client';
import { IMiddleware } from '../middleware/middleware.interface';
import { IJWTService } from '../../JWTService/JWT.service.interface';

export interface IAuthGuardFactory {
    create(role: Roles): IMiddleware;
}
