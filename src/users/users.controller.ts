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
import { Roles } from '../roles/roles';

@injectable()
export class UsersController extends Controller implements IController {
    constructor(
        @inject(TYPES.logger) private logger: ILogger,
        @inject(TYPES.usersService) private usersService: IUsersService,
        @inject(TYPES.jwtService) private jwtService: IJwtService,
        @inject(TYPES.authGuardFactory) private authGuardFactory: IAuthGuardFactory,
        @inject(TYPES.rolesService) private rolesService: IRolesService,
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
                    this.authGuardFactory.create([Roles.USER]),
                ],
            },
            {
                path: '/update',
                method: 'patch',
                func: this.update,
                middlewares: [
                    new ValidateMiddleware(UserUpdateDto),
                    this.authGuardFactory.create([Roles.USER]),
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
        // #swagger.start
        /*
        #swagger.path = '/users/register'
        #swagger.method = 'post'
        #swagger.description = 'Register new user.'
        #swagger.tags = ['Users']
 
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/userRegister"
                    } 
                }
            }
        } 
        #swagger.responses[200] = {
            description: "Success register new user",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/successRegister",
                    }
                }           
            }
        }   
        #swagger.responses[422] = {
            description: "User already registered",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/userAlreadyRegistered",           
                    }
                }           
            }
        }
        #swagger.end
        */
        const result = await this.usersService.createUser(body);

        if (!result) {
            return next(new HttpException('Пользователь уже зарегистрирован', 422, body));
        }

        return this.ok(res, { message: 'Пользователь успешно зарегистрирован' });
    }

    async login(
        { body }: Request<{}, {}, UserLoginDto, {}, {}>,
        res: Response,
        next: NextFunction,
    ): Promise<void | Response> {
        // #swagger.start
        /*
        #swagger.path = '/users/login'
        #swagger.method = 'post'
        #swagger.description = 'Login use email and password.'
        #swagger.tags = ['Users']
 
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/loginUser"
                    } 
                }
            }
        } 
        #swagger.responses[200] = {
            description: "Success register new user",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/successLogin",
                    }
                }           
            }
        }   
        #swagger.responses[401] = {
            description: "Wrong email or password",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/wrongData",
                    }
                }           
            }
        }
        #swagger.responses[422] = {
            description: "Failed validation",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/errorMessage",              
                    },
                }           
            }
        }
        #swagger.end
        */
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
        // #swagger.start
        /*

        #swagger.path = '/users/delete'
        #swagger.method = 'delete'
        #swagger.description = 'Delete user by own id.'
        #swagger.tags = ['Users']
        #swagger.security = [{
            "bearerAuth": []
        }]
 
        #swagger.responses[200] = {
            description: "Success deleted new user",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/successDelete",
                    }
                }           
            }
        } 

        #swagger.responses[403] = {
            description: "Failed authorization",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/authorizationError",            
                    },
                }           
            }
        }
        #swagger.end
        */

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

        this.ok(res, { message: 'Пользователь успешно удален' });
    }

    async update(
        req: Request<{}, {}, UserUpdateDto, {}, {}>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        // #swagger.start
        /*
        #swagger.path = '/users/update'
        #swagger.method = 'patch'
        #swagger.description = 'Update user data.'
        #swagger.tags = ['Users']
        #swagger.security = [{
            "bearerAuth": []
        }]
 
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/userUpdate"
                    } 
                }
            }
        } 
        #swagger.responses[200] = {
            description: "Success update",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/userSuccessUpdate",
                    }
                }           
            }
        }   
        #swagger.responses[403] = {
            description: "Failed authorization",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/authorizationError",            
                    },
                }           
            }
        }
        #swagger.responses[404] = {
            description: "User is not exist",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/userIsNotExist",
                    }
                }           
            }
        }
        #swagger.responses[422] = {
            description: "Failed validation",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/errorMessage",              
                    },
                }           
            }
        }
        #swagger.end
        */
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
                new HttpException('Ошибка при обновлении данных', 404, JSON.stringify(req.body)),
            );
        }

        this.ok(res, { message: `${body.paramName} успешно обновлен` });
    }
}
