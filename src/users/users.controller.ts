import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Controller } from '../common/controller/abstract.controller';
import { IController } from '../common/controller/controller.interface';
import { TYPES } from '../injectsTypes';
import { ILogger } from '../logger/logger.service.interface';
import { NextFunction, Request, Response } from 'express';
import { UserRegisterDto } from './dto/users.register.dto';
import { UserLoginDto } from './dto/users.login.dto';
import { UserDeleteDto } from './dto/users.delete.dto';
import { UserChangeDto } from './dto/users.change.dto';
import { IUsersService } from './service/users.service.interface';
import { HttpExeption } from '../exeptionFilters/http.exeption';
import { IJWTService } from '../JWTService/JWT.service.interface';

@injectable()
export class UsersController extends Controller implements IController {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.UsersService) private usersService: IUsersService,
        @inject(TYPES.JWTService) private jwtService: IJWTService,
    ) {
        super();
        this.bindRouts([
            { path: '/register', method: 'post', func: this.register },
            { path: '/login', method: 'post', func: this.login },
            { path: '/delete', method: 'post', func: this.delete },
            { path: '/update', method: 'post', func: this.update },
        ]);
        this.logger.success('[UsersController] Успешно подвязанны обработчики роутов');
    }

    async register(
        { body }: Request<{}, {}, UserRegisterDto>,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        const result = await this.usersService.createUser(body);

        if (!result) {
            return next(
                new HttpExeption(
                    'Пользователь уже зарегистрирован',
                    409,
                    '[UsersController.register]',
                ),
            );
        }

        return this.ok(res, { message: 'Пользователь успешно зарегистрирован' });
    }

    async login(
        { body }: Request<{}, {}, UserLoginDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void | Response> {
        const validUser = await this.usersService.validateUser(body);

        if (!validUser) {
            return this.unauthorized(res, 'Не верный логин или пароль');
        }
        const roles = await this.usersService.getRoles(validUser.id);
        const token = await this.jwtService.sign(roles);

        this.ok(res, { message: 'Аутентификация выполнена успешно', token });
    }

    async delete(
        { body }: Request<{}, {}, UserDeleteDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {}

    async update(
        { body }: Request<{}, {}, UserChangeDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {}
}
