export class UserAlreadyExistsError extends Error {
  constructor() {
    super('User with e-mail already exists')
  }
}
