export abstract class BaseService<T> {
	abstract execute(...args: never): T | Promise<T>;
}
