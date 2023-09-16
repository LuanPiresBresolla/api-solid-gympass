import { UsersRepository } from '@/repositories/users-repository'
import { Prisma, User } from '@prisma/client'
import { randomUUID } from 'crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      ...data,
      id: randomUUID(),
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((item) => item.id === id)

    if (!user) return null

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((item) => item.email === email)

    if (!user) return null

    return user
  }
}
