import { Container, ContainerModule } from 'inversify';
import { TYPES } from './injectsTypes';
import { ILogger } from './logger/logger.service.interface';
import { LoggerService } from './logger/logger.service';
import { App } from './app';
import { IController } from './common/controller/controller.interface';
import { UsersController } from './users/users.controller';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { IUsersService } from './users/service/users.service.interface';
import { UsersService } from './users/service/users.service';
import { IUsersRepository } from './users/repository/users.repository.interface';
import { UserRepository } from './users/repository/users.repository';

type MainReturnType = { app: App; container: Container };

async function main(): Promise<MainReturnType> {
    const container = buidContainer();
    const app = container.get<App>(TYPES.App);
    await app.init();
    return { app, container };
}

function buidContainer(): Container {
    const container = new Container();
    const mainModule = new ContainerModule(bind => {
        bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
        bind<IController>(TYPES.UsersController).to(UsersController);

        bind<IConfigService>(TYPES.ConfigService)
            .to(ConfigService)
            .inSingletonScope();

        bind<PrismaService>(TYPES.PrismaService)
            .to(PrismaService)
            .inSingletonScope();

        bind<IUsersService>(TYPES.UsersService)
            .to(UsersService)
            .inSingletonScope();

        bind<IUsersRepository>(TYPES.UserRepository)
            .to(UserRepository)
            .inSingletonScope();

        bind<App>(TYPES.App).to(App).inSingletonScope();
    });
    container.load(mainModule);
    return container;
}

export const box = main();
