import 'reflect-metadata';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { Server } from 'node:http';
import { json } from 'body-parser';
import { TYPES } from './injectsTypes';
import { ILogger } from './logger/logger.service.interface';
import { IController } from './common/controller/controller.interface';
import { IExeptionsFilters } from './exeptionFilters/exeptions.filters.interface';

@injectable()
export class App {
    port: number;
    server: Server;
    app: Express;

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.UsersController) private usersController: IController,
        @inject(TYPES.ExeptionsFilters) private exeptionFilters: IExeptionsFilters,
        @inject(TYPES.AdminController) private adminController: IController,
    ) {
        this.app = express();
        this.port = 8000;
    }

    private useExeptionFilters(): void {
        this.app.use(this.exeptionFilters.execute.bind(this.exeptionFilters));
    }

    private useMiddlewares(): void {
        this.app.use(json());
    }

    private useRoutes(): void {
        this.app.use('/users', this.usersController.router);
        this.app.use('/admin', this.adminController.router);
        // this.app.use('/products');
    }

    public async init(): Promise<void> {
        this.useMiddlewares();
        this.useRoutes();
        this.useExeptionFilters();
        this.app.listen(this.port);
        this.logger.success(`Сервер запущен на порту ${this.port}`);
    }
}
