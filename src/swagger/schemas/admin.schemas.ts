export const adminSchemas = {
    appointRole: {
        email: 'Alex@mail.ru',
    },
    removeRole: {
        email: 'Alex@mail.ru',
    },
    successResponseAppointRole: {
        '@enum': ['Роль назначена успешно', 'Пользователю уже назначена роль'],
    },
    successAppointRole: {
        message: { $ref: '#/components/schemas/successResponseAppointRole' },
    },
    roleAppointUserIsNotExist: {
        message: 'Ошибка при назначении роли',
        error: 'Пользователя не существует',
    },
    successResponseRemoveRole: {
        '@enum': ['Роль успешно отозвана', 'У пользователя уже отсутствует роль'],
    },
    successRemoveRole: {
        message: { $ref: '#/components/schemas/successResponseRemoveRole' },
    },
    roleRemoveUserIsNotExist: {
        message: 'Ошибка при удалении роли',
        error: 'Пользователя не существует',
    },
};
