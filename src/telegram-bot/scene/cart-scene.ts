import 'reflect-metadata';
import { MyScene } from './common/base-scene';
import { injectable } from 'inversify';
import { MyContext } from '../common/context';
import { Scenes } from 'telegraf';
import { SCENES_ID } from './scenes-id';
import { cartKeyboard, emptyCartKeyboard } from './keyboard/cart-scene-keyboard';

@injectable()
export class CartScene extends MyScene {
    constructor() {
        super();
        this.scene = new Scenes.BaseScene<MyContext>(SCENES_ID.cart);
        this.scene.enter(this.enter.bind(this));
        this.useActions();
    }

    async enter(ctx: MyContext, next: () => Promise<void>): Promise<void> {
        if (ctx.session.cart === undefined || ctx.session.cart.length === 0) {
            await ctx.reply('Ваша корзина пуста, добавить товары?', {
                reply_markup: {
                    inline_keyboard: emptyCartKeyboard,
                },
            });
            return;
        }

        const bodyCart = ctx.session.cart
            .map(({ product, count }) => {
                return `\n\n${product.title}\n${count} штук на сумму ${product.price * count}р.`;
            })
            .join('');

        await ctx.reply(
            `В козине ${ctx.cart.amountProducts()} товаров, на сумму ${ctx.cart.sumPriceProducts()}р
            ${bodyCart}
            `,
            {
                reply_markup: {
                    inline_keyboard: cartKeyboard,
                },
            },
        );
    }

    useActions(): void {
        this.scene.action('goToProducts', async ctx => {
            return await ctx.scene.enter(SCENES_ID.products);
        });

        this.scene.action('goToMain', async ctx => {
            return await ctx.scene.enter(SCENES_ID.main);
        });
        this.scene.action('cleaningCart', async ctx => {
            ctx.session.cart = [];
            ctx.scene.enter(SCENES_ID.cart);
        });
    }
}
