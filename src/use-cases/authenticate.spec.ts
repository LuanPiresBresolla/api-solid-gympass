import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { hash } from 'bcryptjs'

let usersRepository: InMemoryUsersRepository
let authenticateUseCase: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUseCase = new AuthenticateUseCase(usersRepository)
  })

  it('should be able a create new authentication', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johjdoe@mail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await authenticateUseCase.execute({
      email: 'johjdoe@mail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      authenticateUseCase.execute({
        email: 'johjdoe@mail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johjdoe@mail.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      authenticateUseCase.execute({
        email: 'johjdoe@mail.com',
        password: '45465',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
