import { Request, Response, NextFunction, RolesChangeQueryParams } from 'express';
import { IMiddleware } from './../common/interfaces/middleware.interface';
import { Roles } from '@prisma/client';
import { HttpException } from '../exceptionFilters/http.exception';
import { isRole } from './common/assert.roles';

export class RolesQueryValidateMiddleware implements IMiddleware {
    constructor(private userRole: Extract<Roles, 'ADMIN' | 'SUPER_ADMIN'>) {}

    async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { role, email } = req.query;

        if (typeof email !== 'string') {
            return next(
                new HttpException(
                    'Ошибка передачи данных',
                    400,
                    'Не верно передан или не передан параметр [email]',
                ),
            );
        }

        req.rolesChangeQueryParams = {
            email,
        };

        if (this.userRole === 'ADMIN') {
            req.rolesChangeQueryParams.role = 'GENERAL_WAREHOUS';
            return next();
        }

        if (this.userRole === 'SUPER_ADMIN') {
            return this.validateSuperAdmin(role, req, next);
        }

        return next(new HttpException('У пользователя недостаточно прав', 403));
    }

    validateSuperAdmin(role: unknown, req: Request, next: NextFunction): void {
        if (!isRole(role)) {
            return next(
                new HttpException(
                    'Ошибка передачи данных',
                    400,
                    'Не верно передан или не передан параметр [role]',
                ),
            );
        }
        (req.rolesChangeQueryParams as RolesChangeQueryParams).role = role;
        return next();
    }
}
