export default class CheckLoginSessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CheckLoginSessionError';
  }
}
