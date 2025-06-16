import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'match',
			target: object.constructor,
			propertyName,
			constraints: [property],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints as string[];
					const relatedValue = (args.object as Record<string, unknown>)[
						relatedPropertyName
					];
					return value === relatedValue;
				},
				defaultMessage(args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints as string[];
					return `${propertyName} must match ${relatedPropertyName}`;
				},
			},
		});
	};
}
