import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { MAX_AMOUNT_INLINE_BUTTONS } from './buttons';

export const backFirsStepButtonProductsScene: InlineKeyboardButton[] = [
    { text: '◀️Назад', callback_data: 'backFirstStepCallback' },
];

export const productCardViewKeyboard = [
    [{ text: 'Добавить в корзину', callback_data: 'addToCard' }],
    [{ text: '◀️Назад', callback_data: 'backProductCardCallback' }],
];

export function getPagesButtonsChoiceCategoryKeyboard(
    page: number,
    lengthCategoryArray: number,
): InlineKeyboardButton[] {
    let keyboard = [];
    const maxPage = Math.ceil(lengthCategoryArray / MAX_AMOUNT_INLINE_BUTTONS);

    if (page === 1) {
        keyboard = [
            { text: `- ${page} -`, callback_data: `page-${page}` },
            { text: `${page + 1} >`, callback_data: `page-${page + 1}` },
            { text: `${maxPage} >>`, callback_data: `page-${maxPage}` },
        ];
    } else if (page === maxPage) {
        keyboard = [
            { text: `<< ${1}`, callback_data: `page-${1}` },
            { text: `< ${page - 1}`, callback_data: `page-${page - 1}` },
            { text: `- ${page} -`, callback_data: `page-${page}` },
        ];
    } else {
        keyboard = [
            { text: `<< ${1}`, callback_data: `page-${1}` },
            { text: `< ${page - 1}`, callback_data: `page-${page - 1}` },
            { text: `- ${page} -`, callback_data: `page-${page}` },
            { text: `${page + 1} >`, callback_data: `page-${page + 1}` },
            { text: `${maxPage} >>`, callback_data: `page-${maxPage}` },
        ];
    }
    return keyboard;
}
