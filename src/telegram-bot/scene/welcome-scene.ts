import 'reflect-metadata';
import { MyWizardContext } from '../common/context';
import { Composer, Scenes } from 'telegraf';
import { SCENES_ID } from './scenes-id';
import { WizardScene } from './common/wizard-scene';
import { injectable } from 'inversify';
import { citiesKeyboard, finalWelcomeSceneStepKeyboard } from './keyboard/welcome-scene-keyboards';

@injectable()
export class WelcomeScene extends WizardScene {
    scene: Scenes.WizardScene<MyWizardContext>;

    public citiesActions = citiesKeyboard.map(button => {
        return button[0].callback_data;
    });

    constructor() {
        super();
        this.scene = new Scenes.WizardScene<MyWizardContext>(
            SCENES_ID.welcome,
            ...[
                this.firstStep.bind(this),
                this.citiesSetActionsStep.bind(this)(),
                this.addressStep.bind(this)(),
                this.finalStep.bind(this)(),
            ],
        );
        this.scene.leave(this.leave.bind(this));
    }

    async leave(ctx: MyWizardContext): Promise<void> {
        await ctx.reply('Данные успешно сохранены');
    }

    async firstStep(ctx: MyWizardContext): Promise<Scenes.WizardContextWizard<MyWizardContext>> {
        await ctx.reply('Выберете город доставки:', {
            reply_markup: {
                inline_keyboard: citiesKeyboard,
            },
        });

        return ctx.wizard.next();
    }

    citiesSetActionsStep(): Composer<MyWizardContext> {
        const step = new Composer<MyWizardContext>();

        for (const city of this.citiesActions) {
            step.action(city, async ctx => {
                ctx.session.city = city;
                await ctx.reply('Отлично, теперь введите ваш адрес:');
                return ctx.wizard.next();
            });
        }

        return step;
    }

    addressStep(): Composer<MyWizardContext> {
        const step = new Composer<MyWizardContext>();

        step.hears(/.+/, async ctx => {
            ctx.session.address = ctx.message.text;

            await ctx.reply(`Ваш город: ${ctx.session.city} \nВаш адрес: ${ctx.session.address}`, {
                reply_markup: {
                    inline_keyboard: finalWelcomeSceneStepKeyboard,
                },
            });
            return ctx.wizard.next();
        });
        return step;
    }

    finalStep(): Composer<MyWizardContext> {
        const step = new Composer<MyWizardContext>();

        step.action('leave', async ctx => {
            await ctx.scene.enter(SCENES_ID.main);
        });

        step.action('restart', async ctx => {
            return await this.firstStep(ctx);
        });

        return step;
    }
}
