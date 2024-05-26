import 'reflect-metadata';
import { Response, Router } from 'express';
import { IController } from './controller.interface';
import { IRout } from './routs.interface';
import { injectable } from 'inversify';

@injectable()
export abstract class Controller implements IController {
    router: Router = Router();

    bindRouts(routs: IRout[]): void {
        for (const { path, method, func, middlewares } of routs) {
            const middlewaresArray = middlewares?.map(m => m.execute.bind(m));
            const hundler = func.bind(this);
            const executers = middlewaresArray
                ? [...middlewaresArray, hundler]
                : hundler;

            this.router[method](path, executers);
        }
    }
    send<T extends string | object>(
        res: Response,
        status: number,
        message: T,
    ): Response {
        res.status(status);
        return res.send(message);
    }

    redirect(res: Response, rout: string): void {
        return res.redirect(rout);
    }

    ok<T extends string | object>(res: Response, message: T): Response {
        return this.send(res, 200, message);
    }

    created<T extends string | object>(res: Response, message: T): Response {
        return this.send(res, 201, message);
    }

    badRequest<T extends string | object>(res: Response, message: T): Response {
        return this.send(res, 400, message);
    }

    unauthorized<T extends string | object>(
        res: Response,
        message: T,
    ): Response {
        return this.send(res, 401, message);
    }

    notFound<T extends string | object>(res: Response, message: T): Response {
        return this.send(res, 404, message);
    }
}
