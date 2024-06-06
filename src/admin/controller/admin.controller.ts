import 'reflect-metadata';
import { Controller } from '../../common/controller/abstract.controller';
import { IController } from '../../common/controller/controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../injectsTypes';
import { ILogger } from '../../logger/logger.service.interface';
import { IAuthGuardFactory } from '../../common/guard/auth.guard.factory.interface';
import { IRolesService } from '../../roles/service/roles.service.interface';
import { NextFunction, Request, Response, RolesChangeQueryParams } from 'express';
import { RolesQueryValidateMiddleware } from '../../roles/middleware/roles.middleware';
import { IUsersService } from '../../users/service/users.service.interface';
import { HttpExeption } from '../../exeptionFilters/http.exeption';
import { Roles } from '@prisma/client';

@injectable()
export class AdminController extends Controller implements IController {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.AuthGuardFactory) private authGuardFactory: IAuthGuardFactory,
        @inject(TYPES.RolesService) private rolesService: IRolesService,
        @inject(TYPES.UsersService) private userService: IUsersService,
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
                new HttpExeption('Ошибка при назначении роли', 401, 'Пользователя не существует'),
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
                new HttpExeption('Ошибка при удалении роли', 401, 'Пользователя не существует'),
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
