import 'reflect-metadata';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { Server } from 'node:http';
import { json } from 'body-parser';
import { TYPES } from './injectsTypes';
import { ILogger } from './logger/logger.service.interface';
import { IController } from './common/controller/controller.interface';

@injectable()
export class App {
    port: number;
    server: Server;
    app: Express;

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.UsersController) private usersController: IController,
    ) {
        this.app = express();
        this.port = 8000;
    }

    private useExeptionFilters(): void {
        //
    }

    private useMiddlewares(): void {
        this.app.use(json());
    }

    private useRoutes(): void {
        this.app.use('/users', this.usersController.router);
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
