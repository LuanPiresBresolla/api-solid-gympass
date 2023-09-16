import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from '@/use-cases/create-gym'

let gymsRepository: InMemoryGymsRepository
let createGymUseCase: CreateGymUseCase

describe('Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    createGymUseCase = new CreateGymUseCase(gymsRepository)
  })

  it('should be able a create new gym', async () => {
    const { gym } = await createGymUseCase.execute({
      description: 'teste',
      phone: '888888',
      title: 'dasdasdas',
      latitude: -27.8143599,
      longitude: -50.3172257,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
