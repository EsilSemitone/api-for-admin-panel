import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsMinThan(number: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      name: 'IsMinThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [number],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Number(value) < number 
        },
      },
    });
  };
}

export function IsMoreThan(number: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string): void {
      registerDecorator({
        name: 'IsMoreThan',
        target: object.constructor,
        propertyName: propertyName,
        constraints: [number],
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            return Number(value) > number 
          },
        },
      });
    };
  }