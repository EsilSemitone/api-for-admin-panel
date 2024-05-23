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

@injectable()
export class UsersController extends Controller implements IController {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.UsersService) private usersService: IUsersService,
    ) {
        super();
        this.bindRouts([
            { path: '/register', method: 'post', func: this.register },
            { path: '/login', method: 'post', func: this.login },
            { path: '/delete', method: 'post', func: this.delete },
            { path: '/update', method: 'post', func: this.update },
        ]);
        this.logger.success(
            '[UsersController] Успешно подвязанны обработчики роутов',
        );
    }

    async register(
        { body }: Request<{}, {}, UserRegisterDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const result = this.usersService.createUser(body);

        if (!result) {
            return next(
                new HttpExeption(
                    'Пользователь уже зарегистрирован',
                    409,
                    'UsersController.register',
                ),
            );
        }

        this.ok(res, { message: body.email });
    }

    async login(
        { body }: Request<{}, {}, UserLoginDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {}

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
