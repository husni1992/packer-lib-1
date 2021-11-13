export class APIException extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'APIException';
	}
}

export class FileNotFoundException extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'FileNotFoundException';
	}
}
