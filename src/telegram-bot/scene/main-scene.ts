import 'reflect-metadata';
import { MyContext } from '../common/context';
import { MyScene } from './common/base-scene';
import { SCENES_ID } from './scenes-id';
import { injectable } from 'inversify';
import { Scenes } from 'telegraf';
import { BUTTONS } from './keyboard/buttons';

@injectable()
export class MainScene extends MyScene {
    constructor() {
        super();
        this.scene = new Scenes.BaseScene(SCENES_ID.main);
        this.scene.enter(this.enter.bind(this));
        this.scene.hears(BUTTONS.products, async ctx => {
            await ctx.scene.enter(SCENES_ID.products);
        });

        this.scene.hears(BUTTONS.cart, async ctx => {
            await ctx.scene.enter(SCENES_ID.cart);
        });

        this.scene.hears(BUTTONS.change_setting, async ctx => {
            await ctx.scene.enter(SCENES_ID.welcome);
        });
    }

    async enter(ctx: MyContext): Promise<void> {
        await ctx.reply('Мы рады видеть вас снова', {
            reply_markup: {
                keyboard: [[BUTTONS.products, BUTTONS.cart], [BUTTONS.change_setting]],
                is_persistent: true,
                resize_keyboard: true,
                one_time_keyboard: true,
            },
        });
    }
}
