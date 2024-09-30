import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Scenes } from 'telegraf';
import { MyWizardContext } from '../common/context';
import { WizardScene } from './common/wizard-scene';
import { SCENES_ID } from './scenes-id';
import { Cart } from '../common/cart';
import { ProductsSceneProps } from '../common/session';
import { Products, ProductsType } from '../../products/products.types';
import { TYPES } from '../../injectsTypes';
import { IProductsRepository } from '../../products/interfaces/products.repository.interface';
import { IProductsService } from '../../products/interfaces/products.service.interface';
import { Product } from '../../products/entity/product.entity';
import { BUTTONS, MAX_AMOUNT_INLINE_BUTTONS } from './keyboard/buttons';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import {
    backFirsStepButtonProductsScene,
    getPagesButtonsChoiceCategoryKeyboard,
    productCardViewKeyboard,
} from './keyboard/products-scene-keyboard';

@injectable()
export class ProductsScene extends WizardScene {
    scene: Scenes.WizardScene<MyWizardContext>;
    public productsCategories = Object.values(Products) as ProductsType[];

    constructor(
        @inject(TYPES.productsService) public productsService: IProductsService,
        @inject(TYPES.productsRepository) public productsRepository: IProductsRepository,
    ) {
        super();
        this.scene = new Scenes.WizardScene<MyWizardContext>(
            SCENES_ID.products,
            ...[
                this.choiceCategoryView.bind(this),
                this.productsListView.bind(this),
                this.productCardView.bind(this),
            ],
        );

        this.useChoiceCategoryViewActions();
        this.useProductListViewActions();
        this.useProductCardActions();

        this.scene.hears(BUTTONS.change_setting, async ctx => {
            await ctx.scene.enter(SCENES_ID.welcome);
        });
        this.scene.hears(BUTTONS.cart, async ctx => {
            await ctx.scene.enter(SCENES_ID.cart);
        });
    }

    async choiceCategoryView(ctx: MyWizardContext): Promise<void> {
        if (ctx.scene.session.productsScene === undefined) {
            ctx.scene.session.productsScene = {
                category: undefined,
                page: 0,
                currentProductId: undefined,
            };
        }

        await ctx.reply('Выберите категорию товаров', {
            reply_markup: {
                inline_keyboard: this.getChoiceCategoryKeyboard(1),
            },
        });
    }

    getChoiceCategoryKeyboard(page: number): InlineKeyboardButton[][] {
        if (this.productsCategories.length < MAX_AMOUNT_INLINE_BUTTONS) {
            return [
                ...this.productsCategories.map(category => {
                    return [{ text: category, callback_data: `category-${category}` }];
                }),
                backFirsStepButtonProductsScene,
            ];
        }

        return [
            ...this.productsCategories
                .map(category => {
                    return [{ text: category, callback_data: `category-${category}` }];
                })
                .slice(
                    (page - 1) * MAX_AMOUNT_INLINE_BUTTONS,
                    (page - 1) * MAX_AMOUNT_INLINE_BUTTONS + MAX_AMOUNT_INLINE_BUTTONS,
                ),
            getPagesButtonsChoiceCategoryKeyboard(page, this.productsCategories.length),
            backFirsStepButtonProductsScene,
        ];
    }

    async updateChoiceCategoryView(ctx: MyWizardContext, page: number): Promise<void> {
        try {
            await ctx.editMessageText('Выберите категорию товаров', {
                reply_markup: {
                    inline_keyboard: this.getChoiceCategoryKeyboard(page),
                },
            });
        } catch {
            return;
        }
    }

    async productsListView(ctx: MyWizardContext): Promise<void> {
        const { page, category } = ctx.scene.session.productsScene;

        const keyboard = await this.getProductListViewKeyboard(page, category as ProductsType);

        if (!keyboard) {
            await ctx.reply(`По категории ${category} не найдено продуктов`);
            return;
        }

        await ctx.reply(`Выбрана категория: ${ctx.scene.session.productsScene.category}`, {
            reply_markup: {
                inline_keyboard: keyboard,
            },
        });
    }

    async getProductListViewKeyboard(
        page: number,
        category: ProductsType,
    ): Promise<InlineKeyboardButton[][] | undefined> {
        const productsPageList = await this.productsService.getAll({
            page,
            size: MAX_AMOUNT_INLINE_BUTTONS,
            type: category,
        });

        if (productsPageList.length === 0) {
            return;
        }

        return [
            ...productsPageList.map(product => {
                return [
                    {
                        text: `${product.title.slice(0, 15)}... - ${product.price} руб`,
                        callback_data: `productId-${product.id}`,
                    },
                ];
            }),
            [
                { text: '<', callback_data: 'leftProductsListView' },
                { text: '>', callback_data: 'rightProductsListView' },
            ],
            [{ text: '◀️Назад', callback_data: 'backProductsListCallback' }],
        ];
    }

    async updateProductListView(
        ctx: MyWizardContext,
    ): Promise<InlineKeyboardButton[][] | undefined> {
        const { page, category } = ctx.scene.session.productsScene;

        const keyboard = await this.getProductListViewKeyboard(page, category as ProductsType);

        if (!keyboard) {
            return;
        }
        try {
            await ctx.editMessageText(
                `Выбрана категория: ${ctx.scene.session.productsScene.category}`,
                {
                    reply_markup: {
                        inline_keyboard: keyboard,
                    },
                },
            );
            return keyboard;
        } catch {
            return keyboard;
        }
    }

    async productCardView(ctx: MyWizardContext): Promise<void> {
        const product = await this.productsRepository.findById(
            ctx.scene.session.productsScene.currentProductId as number,
        );

        if (!product) {
            await ctx.reply(
                'Извините не удалось отобразить карточку товара, обратитесь в службу поддержки по адресу ...',
            );
            return this.productsListView(ctx);
        }

        const { title, description, price } = product;

        await ctx.reply(
            `*Название*:\n${title}\n\n*Описание:*\n${description}\n\n*Цена: ${price}р*`,
            {
                reply_markup: {
                    inline_keyboard: productCardViewKeyboard,
                },
            },
        );
    }

    useChoiceCategoryViewActions(): void {
        this.scene.action(/(category-).+/, async ctx => {
            ctx.scene.session.productsScene.category = ctx.match[0].split('-')[1] as ProductsType;
            this.productsListView(ctx);
        });

        this.scene.action('backFirstStepCallback', async ctx => {
            ctx.scene.enter(SCENES_ID.main);
        });

        this.scene.action(/(page-)\d+/, async ctx => {
            await this.updateChoiceCategoryView(ctx, Number(ctx.match[0].split('-')[1]));
        });
    }

    useProductListViewActions(): void {
        this.scene.action('leftProductsListView', async ctx => {
            if (ctx.scene.session.productsScene.page === 0) {
                return;
            }
            ctx.scene.session.productsScene.page -= 1;

            const updatedKeyboard = await this.updateProductListView(ctx);

            if (!updatedKeyboard) {
                ctx.scene.session.productsScene.page! += 1;
            }
        });

        this.scene.action('rightProductsListView', async ctx => {
            ctx.scene.session.productsScene.page! += 1;

            const updatedKeyboard = await this.updateProductListView(ctx);

            if (!updatedKeyboard) {
                ctx.scene.session.productsScene.page! -= 1;
            }
        });

        this.scene.action('backProductsListCallback', async ctx => {
            return this.choiceCategoryView(ctx);
        });

        this.scene.action(/(productId-)\d+/, async ctx => {
            ctx.scene.session.productsScene.currentProductId = Number(ctx.match[0].split('-')[1]);
            return this.productCardView(ctx);
        });
    }

    useProductCardActions(): void {
        this.scene.action('addToCard', async ctx => {
            const product = await this.productsRepository.findById(
                ctx.scene.session.productsScene.currentProductId!,
            );

            if (!product) {
                await ctx.reply(
                    'Приносим извинения, к сожалению товар нельзя добавить в корзину, обратитесь в поддержку. ID товара: ' +
                        ctx.scene.session.productsScene.currentProductId,
                );
                return undefined;
            }
            ctx.session.cart = ctx.cart.add(product);

            await ctx.reply('Продукт успешно добавлен в вашу корзину', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Перейти в корзину', callback_data: 'leaveToCart' }],
                    ],
                },
            });
        });

        this.scene.action('backProductCardCallback', async ctx => {
            return this.productsListView(ctx);
        });

        this.scene.action('leaveToCart', async ctx => {
            ctx.scene.enter(SCENES_ID.cart);
        });
    }
}
