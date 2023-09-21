import { prisma } from '@/lib/prisma'
import { hashSync } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@doe.com',
      password_hash: hashSync('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const response = await request(app.server).post('/sessions').send({
    email: 'john@doe.com',
    password: '123456',
  })

  const { token } = response.body

  return { token }
}
