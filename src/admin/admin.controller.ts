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
import { Roles } from '../roles/roles';

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
                    this.authGuardFactory.create([Roles.ADMIN]),
                    new ValidateMiddleware(AppointRoleDto),
                ],
            },
            {
                path: '/remove',
                method: 'delete',
                func: this.removeRole,
                middlewares: [
                    this.authGuardFactory.create([Roles.ADMIN]),
                    new ValidateMiddleware(RemoveRoleDto),
                ],
            },
        ]);
    }

    async appointRole(
        { body }: Request<{}, {}, AppointRoleDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void | Response> {
        // #swagger.start
        /*
        #swagger.path = '/admin/appoint'
        #swagger.method = 'post'
        #swagger.description = 'appoint role GENERAL_WAREHOUSE from user.'
        #swagger.tags = ['Admin']
        #swagger.security = [{
            "bearerAuth": []
        }]
 
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/appointRole"
                    } 
                }
            }
        } 
        #swagger.responses[200] = {
            description: "Success appoint role",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/successAppointRole",
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
                        $ref: "#/components/schemas/roleAppointUserIsNotExist",
                    }
                }           
            }
        }
        #swagger.end
        */
        const { email } = body;
        const isUserExist = await this.userService.getUser(email);

        if (!isUserExist) {
            return next(
                new HttpException('Ошибка при назначении роли', 404, 'Пользователя не существует'),
            );
        }

        const userHasRole = await this.rolesService.has(isUserExist.id, Roles.GENERAL_WAREHOUSE);

        if (userHasRole) {
            return this.ok(res, { message: 'Пользователю уже назначена роль' });
        }

        await this.rolesService.set(isUserExist.id, Roles.GENERAL_WAREHOUSE);

        this.ok(res, { message: 'Роль назначена успешно' });
    }

    async removeRole(
        { body }: Request<{}, {}, RemoveRoleDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void | Response> {
        // #swagger.start
        /*
        #swagger.path = '/admin/remove'
        #swagger.method = 'delete'
        #swagger.description = 'delete role GENERAL_WAREHOUSE from user.'
        #swagger.tags = ['Admin']
        #swagger.security = [{
            "bearerAuth": []
        }]
 
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/removeRole"
                    } 
                }
            }
        } 
        #swagger.responses[200] = {
            description: "Success remove role",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/successRemoveRole",
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
                        $ref: "#/components/schemas/roleRemoveUserIsNotExist",
                    }
                }           
            }
        }
        #swagger.end
        */
        const { email } = body;
        const isUserExist = await this.userService.getUser(email);

        if (!isUserExist) {
            return next(
                new HttpException('Ошибка при удалении роли', 404, 'Пользователя не существует'),
            );
        }

        const userHasRole = await this.rolesService.has(isUserExist.id, Roles.GENERAL_WAREHOUSE);

        if (!userHasRole) {
            return this.ok(res, { message: 'У пользователя уже отсутствует роль' });
        }

        await this.rolesService.delete(isUserExist.id, Roles.GENERAL_WAREHOUSE);

        this.ok(res, { message: 'Роль успешно отозвана' });
    }
}
