import 'reflect-metadata';
import { IMiddleware } from '../middleware/middleware.interface';
import { Request, Response, NextFunction } from 'express';
import { Roles } from '@prisma/client';
import { HttpExeption } from '../../exeptionFilters/http.exeption';
import { IJWTService } from '../../JWTService/JWT.service.interface';

export class AuthGuard implements IMiddleware {
    exeption: HttpExeption = new HttpExeption(
        'Доступ ограничен',
        403,
        'У пользователя недостаточно прав',
    );

    constructor(
        private role: Roles,
        private jwtService: IJWTService,
    ) {}

    async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
        const authorization = req.headers.authorization?.split(' ')[1];
        if (!authorization) {
            return next(this.exeption);
        }

        const payload = await this.jwtService.verify(authorization);
        const userRoles = payload.role;

        const userHasAcces = userRoles.includes(this.role);

        if (!userHasAcces) {
            return next(this.exeption);
        }

        return next();
    }
}
