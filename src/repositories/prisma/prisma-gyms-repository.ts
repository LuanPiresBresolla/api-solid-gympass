import { prisma } from '@/lib/prisma'
import {
  FindManyNearbyParams,
  GymsRepository,
} from '@/repositories/gyms-repository'
import { Gym, Prisma } from '@prisma/client'

export class PrismaGymsRepository implements GymsRepository {
  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({ data })
    return gym
  }

  async searchMany(search: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: search,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return gyms
  }

  async findById(gymId: string) {
    const gym = await prisma.gym.findUnique({ where: { id: gymId } })
    return gym
  }

  async findManyNearby(params: FindManyNearbyParams) {
    const { latitude, longitude } = params

    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `
    return gyms
  }
}
