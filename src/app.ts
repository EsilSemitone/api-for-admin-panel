import 'reflect-metadata';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { Server } from 'node:http';
import { json } from 'body-parser';
import { TYPES } from './injectsTypes';
import { ILogger } from './logger/logger.service.interface';
import { IExceptionsFilters } from './exceptionFilters/exceptions.filters.interface';
import { IController } from './common/interfaces/controller.interface';

@injectable()
export class App {
    port: number;
    server: Server;
    app: Express;

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.Users_Controller) private usersController: IController,
        @inject(TYPES.Exceptions_Filters) private exceptionFilters: IExceptionsFilters,
        @inject(TYPES.Admin_Controller) private adminController: IController,
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
