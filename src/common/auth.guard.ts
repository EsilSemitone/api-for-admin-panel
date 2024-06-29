import 'reflect-metadata';
import { IMiddleware } from './interfaces/middleware.interface';
import { Request, Response, NextFunction } from 'express';
import { Roles } from '@prisma/client';
import { HttpException } from '../exceptionFilters/http.exception';
import { IJwtService } from '../jwtService/jwt.service.interface';

export class AuthGuard implements IMiddleware {
    exception: HttpException = new HttpException(
        'Доступ ограничен',
        403,
        'У пользователя недостаточно прав',
    );

    constructor(
        private role: Roles,
        private jwtService: IJwtService,
    ) {}

    async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
        const authorization = req.headers.authorization?.split(' ')[1];
        if (!authorization) {
            return next(this.exception);
        }

        const { userId, role } = await this.jwtService.verify(authorization);
        req.id = userId;
        req.role = role;

        const userHasAccess = role.includes(this.role);

        if (!userHasAccess) {
            return next(this.exception);
        }

        return next();
    }
}
