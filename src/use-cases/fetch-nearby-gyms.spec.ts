import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from '@/use-cases/fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch gyms with distance nearby', async () => {
    await gymsRepository.create({
      title: 'JavaScript Near',
      description: 'JavaScript',
      phone: '888888',
      latitude: -27.8143599,
      longitude: -50.3172257,
    })

    await gymsRepository.create({
      title: 'TypeScript Far',
      description: 'TypeScript',
      phone: '888888',
      latitude: -26.8143599,
      longitude: -49.3172257,
    })

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: -27.8143399,
      userLongitude: -50.3172157,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Near' }),
    ])
  })
})
