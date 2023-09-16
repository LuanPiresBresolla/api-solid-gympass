import { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { compare } from 'bcryptjs'

interface IRequest {
  email: string
  password: string
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, password }: IRequest) {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
