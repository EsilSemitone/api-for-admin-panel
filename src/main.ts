import { Container, ContainerModule } from 'inversify';
import { TYPES } from './injectsTypes';
import { ILogger } from './logger/logger.service.interface';
import { LoggerService } from './logger/logger.service';
import { App } from './app';
import { IController } from './common/interfaces/controller.interface';
import { UsersController } from './users/users.controller';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { IUsersRepository } from './users/interfaces/users.repository.interface';
import { UserRepository } from './users/users.repository';
import { IJwtService } from './jwtService/jwt.service.interface';
import { JWTService } from './jwtService/jwt.service';
import { IRolesOnUsersRepository } from './roles/interfaces/roles.repository.interface';
import { RolesOnUsersRepository } from './roles/roles.repository';
import { IExceptionsFilters } from './exceptionFilters/exceptions.filters.interface';
import { ExceptionsFilters } from './exceptionFilters/exceptions.filters';
import { IAuthGuardFactory } from './common/interfaces/auth.guard.factory.interface';
import { IRolesService } from './roles/interfaces/roles.service.interface';
import { RolesService } from './roles/roles.service';
import { AdminController } from './admin/admin.controller';
import { AuthGuardFactory } from './common/auth.guard.factory';
import { IUsersService } from './users/interfaces/users.service.interface';
import { UsersService } from './users/users.service';
import { IProductsService } from './products/interfaces/products.service.interface';
import { ProductsService } from './products/products.service';
import { IProductsRepository } from './products/interfaces/products.repository.interface';
import { ProductsRepository } from './products/products.repository';
import { ProductsController } from './products/products.controller';

type MainReturnType = { app: App; container: Container };

function buildContainer(): Container {
    const container = new Container();
    const mainModule = new ContainerModule(bind => {
        bind<App>(TYPES.App).to(App).inSingletonScope();
        bind<IController>(TYPES.Users_Controller).to(UsersController);
        bind<IExceptionsFilters>(TYPES.Exceptions_Filters).to(ExceptionsFilters);
        bind<IAuthGuardFactory>(TYPES.Auth_Guard_Factory).to(AuthGuardFactory);
        bind<IController>(TYPES.Admin_Controller).to(AdminController);
        bind<IController>(TYPES.ProductsController).to(ProductsController);
    });
    const servicesModule = new ContainerModule(bind => {
        bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
        bind<PrismaService>(TYPES.Prisma_Service).to(PrismaService).inSingletonScope();
        bind<IConfigService>(TYPES.Config_Service).to(ConfigService).inSingletonScope();
        bind<IUsersService>(TYPES.Users_Service).to(UsersService).inSingletonScope();
        bind<IJwtService>(TYPES.Jwt_Service).to(JWTService).inSingletonScope();
        bind<IRolesService>(TYPES.Roles_Service).to(RolesService);
        bind<IProductsService>(TYPES.ProductsService).to(ProductsService);
    });

    const repositoryModule = new ContainerModule(bind => {
        bind<IUsersRepository>(TYPES.User_Repository).to(UserRepository).inSingletonScope();
        bind<IRolesOnUsersRepository>(TYPES.Roles_Repository).to(RolesOnUsersRepository);
        bind<IProductsRepository>(TYPES.ProductsRepository).to(ProductsRepository);
    });
    container.load(mainModule);
    container.load(servicesModule);
    container.load(repositoryModule);
    return container;
}

async function main(): Promise<MainReturnType> {
    const container = buildContainer();
    const app = container.get<App>(TYPES.App);
    await app.init();
    return { app, container };
}
export const box = main();
