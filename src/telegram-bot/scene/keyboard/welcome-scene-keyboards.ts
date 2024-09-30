import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

export const citiesKeyboard: InlineKeyboardButton.CallbackButton[][] = [
    [{ text: 'Москва', callback_data: 'Москва' }],
    [{ text: 'Санкт-Петербург', callback_data: 'Санкт-Петербург' }],
    [{ text: 'Екатеринбург', callback_data: 'Екатеринбург' }],
    [{ text: 'Тюмень', callback_data: 'Тюмень' }],
    [{ text: 'Новосибирск', callback_data: 'Новосибирск' }],
    [{ text: 'Владивосток', callback_data: 'Владивосток' }],
];

export const finalWelcomeSceneStepKeyboard: InlineKeyboardButton.CallbackButton[][] = [
    [{ text: 'Все верно', callback_data: 'leave' }],
    [{ text: 'Изменить данные', callback_data: 'restart' }],
];
