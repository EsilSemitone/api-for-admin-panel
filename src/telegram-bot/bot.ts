import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Scenes, Telegraf } from 'telegraf';
import { MyContext, MyWizardContext } from './common/context';
import { Command } from './command/command';
import { StartCommand } from './command/start.command';
import LocalSession from 'telegraf-session-local';
import { IScene } from './scene/common/scene.interface';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../injectsTypes';
import { ILogger } from '../logger/logger.service.interface';
import { Cart } from './common/cart';

@injectable()
export class Bot {
    app: Telegraf<MyContext>;
    stage: Scenes.Stage<MyContext | MyWizardContext>;
    commands: Command[];

    constructor(
        @inject(TYPES.configService) private configService: IConfigService,
        @inject(TYPES.logger) private loggerService: ILogger,
        @inject(TYPES.main_Scene) private mainScene: IScene,
        @inject(TYPES.product_Scene) private productScene: IScene,
        @inject(TYPES.welcome_Scene) private quizScene: IScene,
        @inject(TYPES.cart_Scene) private cartScene: IScene,
    ) {
        this.app = new Telegraf<MyContext | MyWizardContext>(this.configService.get('BOT_TOKEN'));
        this.commands = [new StartCommand(this.app)];
        this.stage = new Scenes.Stage<MyContext | MyWizardContext>([
            mainScene.scene,
            productScene.scene,
            quizScene.scene,
            cartScene.scene,
        ]);
    }

    useCommand(): void {
        for (const command of this.commands) {
            command.handle();
        }
    }

    useMiddleware(): void {
        this.app.use(new LocalSession({ database: 'session.json' }).middleware());
        this.app.use((ctx, next) => {
            ctx.cart = new Cart(ctx);
            return next();
        });
        this.app.use(this.stage.middleware());
    }

    init(): void {
        this.useMiddleware();
        this.useCommand();
        this.app.launch(() => {
            this.loggerService.info('Бот успешно запущен');
        });
    }
}
