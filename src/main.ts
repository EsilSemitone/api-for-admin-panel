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
import { Bot } from './telegram-bot/bot';
import { CartScene } from './telegram-bot/scene/cart-scene';
import { MainScene } from './telegram-bot/scene/main-scene';
import { ProductsScene } from './telegram-bot/scene/products-scene';
import { WelcomeScene } from './telegram-bot/scene/welcome-scene';

type MainReturnType = { app: App; container: Container };

const container = new Container();

const commonModule = new ContainerModule(bind => {
    bind<App>(TYPES.app).to(App).inSingletonScope();
    bind<IExceptionsFilters>(TYPES.exceptionsFilters).to(ExceptionsFilters);
    bind<IConfigService>(TYPES.configService).to(ConfigService).inSingletonScope();
    bind<IJwtService>(TYPES.jwtService).to(JWTService).inSingletonScope();
});

const userModule = new ContainerModule(bind => {
    bind<IController>(TYPES.usersController).to(UsersController);
    bind<IUsersService>(TYPES.usersService).to(UsersService).inSingletonScope();
    bind<IUsersRepository>(TYPES.userRepository).to(UserRepository).inSingletonScope();
    bind<ILogger>(TYPES.logger).to(LoggerService).inSingletonScope();
    bind<PrismaService>(TYPES.prismaService).to(PrismaService).inSingletonScope();
    bind<IAuthGuardFactory>(TYPES.authGuardFactory).to(AuthGuardFactory);
});

const adminModule = new ContainerModule(bind => {
    bind<IController>(TYPES.adminController).to(AdminController);
});

const rolesModule = new ContainerModule(bind => {
    bind<IRolesService>(TYPES.rolesService).to(RolesService).inSingletonScope();
    bind<IRolesOnUsersRepository>(TYPES.rolesRepository)
        .to(RolesOnUsersRepository)
        .inSingletonScope();
});

const productsModule = new ContainerModule(bind => {
    bind<IController>(TYPES.productsController).to(ProductsController);
    bind<IProductsService>(TYPES.productsService).to(ProductsService).inSingletonScope();
    bind<IProductsRepository>(TYPES.productsRepository).to(ProductsRepository).inSingletonScope();
});

const botModule = new ContainerModule(bind => {
    bind<Bot>(TYPES.bot).to(Bot);
    bind<MainScene>(TYPES.main_Scene).to(MainScene).inSingletonScope();
    bind<ProductsScene>(TYPES.product_Scene).to(ProductsScene).inSingletonScope();
    bind<WelcomeScene>(TYPES.welcome_Scene).to(WelcomeScene).inSingletonScope();
    bind<CartScene>(TYPES.cart_Scene).to(CartScene).inSingletonScope();
});

function buildContainer(): Container {
    commonModule;
    container.load(commonModule);
    container.load(userModule);
    container.load(adminModule);
    container.load(rolesModule);
    container.load(productsModule);
    container.load(botModule);
    return container;
}

async function main(): Promise<MainReturnType> {
    const container = buildContainer();
    const app = container.get<App>(TYPES.app);
    const bot = container.get<Bot>(TYPES.bot);
    await app.init();
    bot.init();

    return { app, container };
}
export const box = main();
