import { ConflictException } from '@nestjs/common';

interface Limits {
	max: number;
	current: number;
	notAllowedMessage?: string;
	isAllowedMessage?: string;
}

export function verifyLimits(limits: Limits): void {
	if (limits.current >= limits.max) {
		const message = limits.notAllowedMessage || 'Limit exceeded';
		throw new ConflictException(message);
	}
}
