import 'reflect-metadata';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { Server } from 'node:http';
import { json } from 'body-parser';
import { TYPES } from './injectsTypes';
import { ILogger } from './logger/logger.service.interface';
import { IExceptionsFilters } from './exceptionFilters/exceptions.filters.interface';
import { IController } from './common/interfaces/controller.interface';
import { swaggerMiddlewares } from './swagger/swagger.middleware';

@injectable()
export class App {
    port: number;
    server: Server;
    app: Express;

    constructor(
        @inject(TYPES.logger) private logger: ILogger,
        @inject(TYPES.usersController) private usersController: IController,
        @inject(TYPES.exceptionsFilters) private exceptionFilters: IExceptionsFilters,
        @inject(TYPES.adminController) private adminController: IController,
        @inject(TYPES.productsController) private productsController: IController,
    ) {
        this.app = express();
        this.port = 8000;
    }

    private useExceptionFilters(): void {
        this.app.use(this.exceptionFilters.execute.bind(this.exceptionFilters));
    }

    private useMiddlewares(): void {
        this.app.use(json());
    }

    private useRoutes(): void {
        this.app.use('/users', this.usersController.router);
        this.app.use('/admin', this.adminController.router);
        this.app.use('/products', this.productsController.router);
        this.app.use('/api-doc', swaggerMiddlewares());
    }

    public async init(): Promise<void> {
        this.useMiddlewares();
        this.useRoutes();
        this.useExceptionFilters();
        this.server = this.app.listen(this.port);
        this.logger.success(`Сервер запущен на порту ${this.port}`);
    }

    public close(): void {
        this.server.close();
    }
}
