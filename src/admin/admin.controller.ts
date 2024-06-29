import 'reflect-metadata';
import { IController } from '../common/interfaces/controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../injectsTypes';
import { ILogger } from '../logger/logger.service.interface';
import { IAuthGuardFactory } from '../common/interfaces/auth.guard.factory.interface';
import { IRolesService } from '../roles/interfaces/roles.service.interface';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptionFilters/http.exception';
import { Controller } from '../common/abstract.controller';
import { IUsersService } from '../users/interfaces/users.service.interface';
import { AppointRoleDto } from './appoint.role.dto';
import { ValidateMiddleware } from '../common/validate.middleware';
import { RemoveRoleDto } from './remove.role.dto';

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
                func: this.appointRole,
                middlewares: [
                    this.authGuardFactory.create('ADMIN'),
                    new ValidateMiddleware(AppointRoleDto),
                ],
            },
            {
                path: '/remove',
                method: 'delete',
                func: this.removeRole,
                middlewares: [
                    this.authGuardFactory.create('ADMIN'),
                    new ValidateMiddleware(RemoveRoleDto),
                ],
            },
        ]);
    }

    async appointRole(
        { body }: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void | Response> {
        const { email } = body;
        const isUserExist = await this.userService.getUser(email);

        if (!isUserExist) {
            return next(
                new HttpException('Ошибка при назначении роли', 401, 'Пользователя не существует'),
            );
        }

        const userHasRole = await this.rolesService.has(isUserExist.id, 'GENERAL_WAREHOUS');

        if (userHasRole) {
            return this.ok(res, 'Пользователю уже назначена роль');
        }

        await this.rolesService.set(isUserExist.id, 'GENERAL_WAREHOUS');

        this.ok(res, 'Роль назначена успешно');
    }

    async removeRole(
        { body }: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void | Response> {
        const { email } = body;
        const isUserExist = await this.userService.getUser(email);

        if (!isUserExist) {
            return next(
                new HttpException('Ошибка при удалении роли', 401, 'Пользователя не существует'),
            );
        }

        const userHasRole = await this.rolesService.has(isUserExist.id, 'GENERAL_WAREHOUS');

        if (!userHasRole) {
            return this.ok(res, 'У пользователя уже отсутствует роль');
        }

        await this.rolesService.delete(isUserExist.id, 'GENERAL_WAREHOUS');

        this.ok(res, 'Роль успешно отозвана');
    }
}
