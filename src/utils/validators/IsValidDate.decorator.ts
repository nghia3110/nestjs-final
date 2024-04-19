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
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const comparisonDate = new Date(value);
          comparisonDate.setHours(0, 0, 0, 0);
          return typeof value === 'string' && comparisonDate >= today;
        },
      },
    });
  };
}
