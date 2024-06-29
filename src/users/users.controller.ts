import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { IController } from '../common/interfaces/controller.interface';
import { TYPES } from '../injectsTypes';
import { ILogger } from '../logger/logger.service.interface';
import { NextFunction, Request, Response } from 'express';
import { UserRegisterDto } from './dto/users.register.dto';
import { UserLoginDto } from './dto/users.login.dto';
import { UserDeleteDto } from './dto/users.delete.dto';
import { UserUpdateDto } from './dto/users.update.dto';
import { HttpException } from '../exceptionFilters/http.exception';
import { IJwtService } from '../jwtService/jwt.service.interface';
import { IAuthGuardFactory } from '../common/interfaces/auth.guard.factory.interface';
import { IRolesService } from '../roles/interfaces/roles.service.interface';
import { Controller } from '../common/abstract.controller';
import { ValidateMiddleware } from '../common/validate.middleware';
import { IUsersService } from './interfaces/users.service.interface';

@injectable()
export class UsersController extends Controller implements IController {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.Users_Service) private usersService: IUsersService,
        @inject(TYPES.Jwt_Service) private jwtService: IJwtService,
        @inject(TYPES.Auth_Guard_Factory) private authGuardFactory: IAuthGuardFactory,
        @inject(TYPES.Roles_Service) private rolesService: IRolesService,
    ) {
        super();
        this.bindRouts([
            {
                path: '/register',
                method: 'post',
                func: this.register,
                middlewares: [new ValidateMiddleware(UserRegisterDto)],
            },
            {
                path: '/login',
                method: 'post',
                func: this.login,
                middlewares: [new ValidateMiddleware(UserLoginDto)],
            },
            {
                path: '/delete',
                method: 'delete',
                func: this.delete,
                middlewares: [
                    new ValidateMiddleware(UserDeleteDto),
                    this.authGuardFactory.create('USER'),
                ],
            },
            {
                path: '/update',
                method: 'patch',
                func: this.update,
                middlewares: [
                    new ValidateMiddleware(UserUpdateDto),
                    this.authGuardFactory.create('USER'),
                ],
            },
        ]);
        this.logger.success('[UsersController] Успешно подвязаны обработчики роутов');
    }

    async register(
        { body }: Request<{}, {}, UserRegisterDto, {}, {}>,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        const result = await this.usersService.createUser(body);

        if (!result) {
            return next(
                new HttpException(
                    'Пользователь уже зарегистрирован',
                    422,
                    '[UsersController.register]',
                ),
            );
        }

        return this.ok(res, { message: 'Пользователь успешно зарегистрирован' });
    }

    async login(
        { body }: Request<{}, {}, UserLoginDto, {}, {}>,
        res: Response,
        next: NextFunction,
    ): Promise<void | Response> {
        const validUser = await this.usersService.validateUser(body);

        if (!validUser) {
            return this.unauthorized(res, 'Не верный логин или пароль');
        }
        const roles = await this.rolesService.get(validUser.id);
        const token = await this.jwtService.sign(roles, validUser.id);

        this.ok(res, { message: 'Аутентификация выполнена успешно', token });
    }

    async delete(
        req: Request<{}, {}, UserDeleteDto, {}, {}>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        if (typeof req.id !== 'number') {
            return next(
                new HttpException(
                    'Произошла ошибка при парсинге роли из токена',
                    400,
                    JSON.stringify(req),
                ),
            );
        }
        await this.usersService.deleteUser(req.id);

        this.ok(res, 'Пользователь успешно удален');
    }

    async update(
        req: Request<{}, {}, UserUpdateDto, {}, {}>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const { body, id } = req;

        if (typeof id !== 'number') {
            return next(
                new HttpException(
                    'Произошла ошибка при парсинге роли из токена',
                    400,
                    JSON.stringify(req),
                ),
            );
        }

        const updatedUser = await this.usersService.updateUser(body, id);

        if (!updatedUser) {
            return next(
                new HttpException('Ошибка при обновлении данных', 404, 'Не верно переданы данные'),
            );
        }

        this.ok(res, `${body.paramName} успешно обновлен`);
    }
}
