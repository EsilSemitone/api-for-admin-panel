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
import { ProductsController } from './products/products.controller';;
import {main as mainBot} from '../../bot/src/main'

type MainReturnType = { app: App; container: Container };

const container = new Container();
const mainModule = new ContainerModule(bind => {
    bind<App>(TYPES.app).to(App).inSingletonScope();
    bind<IController>(TYPES.usersController).to(UsersController);
    bind<IExceptionsFilters>(TYPES.exceptionsFilters).to(ExceptionsFilters);
    bind<IAuthGuardFactory>(TYPES.authGuardFactory).to(AuthGuardFactory);
    bind<IController>(TYPES.adminController).to(AdminController);
    bind<IController>(TYPES.productsController).to(ProductsController);
});
const servicesModule = new ContainerModule(bind => {
    bind<IConfigService>(TYPES.configService).to(ConfigService).inSingletonScope();
    bind<IUsersService>(TYPES.usersService).to(UsersService).inSingletonScope();
    bind<IJwtService>(TYPES.jwtService).to(JWTService).inSingletonScope();
    bind<IRolesService>(TYPES.rolesService).to(RolesService).inSingletonScope();
});

const repositoryModule = new ContainerModule(bind => {
    bind<IUsersRepository>(TYPES.userRepository).to(UserRepository).inSingletonScope();
    bind<IRolesOnUsersRepository>(TYPES.rolesRepository).to(RolesOnUsersRepository).inSingletonScope();
});

export const prismaModule = new ContainerModule(bind => {
    bind<ILogger>(TYPES.logger).to(LoggerService).inSingletonScope();
    bind<PrismaService>(TYPES.prismaService).to(PrismaService).inSingletonScope();
}) 

export const productsModule = new ContainerModule(bind => {
    bind<IProductsService>(TYPES.productsService).to(ProductsService).inSingletonScope();
    bind<IProductsRepository>(TYPES.productsRepository).to(ProductsRepository).inSingletonScope();
})

function buildContainer(): Container {
    container.load(mainModule);
    container.load(servicesModule);
    container.load(repositoryModule);
    container.load(prismaModule);
    container.load(productsModule);
    return container;
}

async function main(): Promise<MainReturnType> {
    const container = buildContainer();
    const app = container.get<App>(TYPES.app);
    await app.init();
    mainBot()

    return { app, container };
}
export const box = main();
