import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPastDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return typeof value === 'string' && new Date(value) >= new Date();
        },
      },
    });
  };
}
