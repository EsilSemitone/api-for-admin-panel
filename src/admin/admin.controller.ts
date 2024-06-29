import 'reflect-metadata';
import { IController } from '../common/interfaces/controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../injectsTypes';
import { ILogger } from '../logger/logger.service.interface';
import { IAuthGuardFactory } from '../common/interfaces/auth.guard.factory.interface';
import { IRolesService } from '../roles/interfaces/roles.service.interface';
import { NextFunction, Request, Response, RolesChangeQueryParams } from 'express';
import { HttpException } from '../exceptionFilters/http.exception';
import { Roles } from '@prisma/client';
import { Controller } from '../common/abstract.controller';
import { RolesQueryValidateMiddleware } from '../roles/roles.middleware';
import { IUsersService } from '../users/interfaces/users.service.interface';

@injectable()
export class AdminController extends Controller implements IController {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.Auth_Guard_Factory) private authGuardFactory: IAuthGuardFactory,
        @inject(TYPES.Roles_Service) private rolesService: IRolesService,
        @inject(TYPES.Users_Service) private userService: IUsersService,
    ) {
        super();
        this.bindRouts([
            {
                path: '/appoint',
                method: 'post',
                func: this.appoint,
                middlewares: [
                    this.authGuardFactory.create('ADMIN'),
                    new RolesQueryValidateMiddleware('ADMIN'),
                ],
            },
            {
                path: '/remove',
                method: 'delete',
                func: this.remove,
                middlewares: [
                    this.authGuardFactory.create('ADMIN'),
                    new RolesQueryValidateMiddleware('ADMIN'),
                ],
            },
        ]);
    }

    async appoint(
        { rolesChangeQueryParams }: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void | Response> {
        const { email, role } = rolesChangeQueryParams as RolesChangeQueryParams;
        const isUserExist = await this.userService.getUser(email);

        if (!isUserExist) {
            return next(
                new HttpException('Ошибка при назначении роли', 401, 'Пользователя не существует'),
            );
        }

        const userHasRole = await this.rolesService.has(isUserExist.id, role as Roles);

        if (userHasRole) {
            return this.ok(res, 'Пользователю уже назначена роль');
        }

        await this.rolesService.set(isUserExist.id, role as Roles);

        this.ok(res, 'Роль назначена успешно');
    }

    async remove(
        { rolesChangeQueryParams }: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void | Response> {
        const { email, role } = rolesChangeQueryParams as RolesChangeQueryParams;
        const isUserExist = await this.userService.getUser(email);

        if (!isUserExist) {
            return next(
                new HttpException('Ошибка при удалении роли', 401, 'Пользователя не существует'),
            );
        }

        const userHasRole = await this.rolesService.has(isUserExist.id, role as Roles);

        if (!userHasRole) {
            return this.ok(res, 'У пользователя уже отсутствует роль');
        }

        await this.rolesService.delete(isUserExist.id, role as Roles);

        this.ok(res, 'Роль успешно отозвана');
    }
}
