import 'reflect-metadata';
import { IMiddleware } from './interfaces/middleware.interface';
import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptionFilters/http.exception';
import { IJwtService } from '../jwtService/jwt.service.interface';
import { RolesType } from '../roles/roles';

export class AuthGuard implements IMiddleware {
    exception: HttpException = new HttpException(
        'Доступ ограничен',
        403,
        'У пользователя недостаточно прав',
    );

    constructor(
        private role: RolesType[],
        private jwtService: IJwtService,
    ) {}

    async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
        const authorization = req.headers.authorization?.split(' ')[1];
        if (!authorization) {
            return next(this.exception);
        }

        const { userId, role } = await this.jwtService.verify(authorization);
        let userHasAccess = false;

        for (const r of this.role) {
            if (role.includes(r)) {
                userHasAccess = true;
                req.id = userId;
                req.role = role;
                break;
            }
        }

        if (!userHasAccess) {
            return next(this.exception);
        }
        return next();
    }
}
