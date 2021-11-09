export class APIException extends Error {
  constructor(message: string) {
    super(message);
  }
}
