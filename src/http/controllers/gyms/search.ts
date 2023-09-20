import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    search: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { search, page } = querySchema.parse(request.query)

  const searchGymsUseCase = makeSearchGymsUseCase()

  const gyms = await searchGymsUseCase.execute({
    page,
    search,
  })

  return reply.status(200).send(gyms)
}
