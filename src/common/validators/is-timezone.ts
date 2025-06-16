import {
	registerDecorator,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

const validTimeZones = Intl.supportedValuesOf
	? Intl.supportedValuesOf('timeZone') // Node 18+ / modern browsers
	: []; // fallback empty array

@ValidatorConstraint({ async: false })
class IsTimeZoneConstraint implements ValidatorConstraintInterface {
	validate(value: any) {
		return typeof value === 'string' && validTimeZones.includes(value);
	}

	defaultMessage() {
		return 'Time zone must be a valid IANA time zone string';
	}
}

export function IsTimeZone(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsTimeZoneConstraint,
		});
	};
}
