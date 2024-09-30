import { SCENES_ID } from '../scene/scenes-id';
import { Command } from './command';

export class StartCommand extends Command {
    async handle(): Promise<void> {
        this.app.start(async ctx => {
            await ctx.reply('Добро пожаловать! Для начала я задам пару вопросов.');
            await ctx.scene.enter(SCENES_ID.welcome);
        });
    }
}
