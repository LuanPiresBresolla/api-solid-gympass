import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { RegisterUseCase } from '@/use-cases/register'
import { compare } from 'bcryptjs'

let usersRepository: InMemoryUsersRepository
let registerUseCase: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(usersRepository)
  })

  it('should be able a create new user', async () => {
    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johjdoe@mail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be able a create hash for password the user', async () => {
    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johjdoe@mail.com',
      password: '123456',
    })

    const isPasswordMatch = await compare('123456', user.password_hash)

    expect(isPasswordMatch).toBe(true)
  })

  it('should not be able a create user with same email', async () => {
    const email = 'johjdoe@mail.com'

    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
