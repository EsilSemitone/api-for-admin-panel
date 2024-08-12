import { params } from '../../users/dto/users.update.dto';

export const usersSchemas = {
    userRegister: {
        name: 'Alex',
        email: 'Alex@mail.ru',
        password: 'sdv8sv9_vd99sevn',
    },
    successRegister: {
        message: 'Пользователь успешно зарегистрирован',
    },
    userAlreadyRegistered: {
        message: 'Пользователь уже зарегистрирован',
        error: { $ref: '#/components/schemas/userRegister' },
    },
    loginUser: {
        email: 'Alex@mail.ru',
        password: 'sdv8sv9_vd99sevn',
    },
    wrongData: {
        message: 'Не верный логин или пароль',
    },
    successLogin: {
        message: 'Аутентификация выполнена успешно',
        token: 'some token',
    },
    userUpdateParams: {
        '@enum': ['name', 'email', 'password'],
    },
    successDelete: {
        message: 'Пользователь успешно удален',
    },
    userDataUpdate: {
        $name: 'Alex',
        $email: 'Alex@mail.ru',
        $password: 'sdv8sv9_vd99sevn',
    },
    userUpdate: {
        email: 'Alex@mail.ru',
        paramName: { $ref: '#/components/schemas/userUpdateParams' },
        data: { $ref: '#/components/schemas/userDataUpdate' },
    },
    userIsNotExist: {
        message: 'Ошибка при обновлении данных',
        error: { $ref: '#/components/schemas/userUpdate' },
    },
    userSuccessUpdate: {
        message: '{username} успешно обновлен',
    },
};
