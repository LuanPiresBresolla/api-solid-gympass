import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from '@/use-cases/search-gyms'

let gymsRepository: InMemoryGymsRepository
let searchGymsUseCase: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    searchGymsUseCase = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      description: 'JavaScript',
      phone: '888888',
      title: 'JavaScript',
      latitude: -27.8143599,
      longitude: -50.3172257,
    })

    await gymsRepository.create({
      description: 'TypeScript',
      phone: '888888',
      title: 'TypeScript',
      latitude: -27.8143599,
      longitude: -50.3172257,
    })

    const { gyms } = await searchGymsUseCase.execute({
      search: 'JavaScript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'JavaScript' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let index = 1; index <= 22; index++) {
      await gymsRepository.create({
        title: `JavaScript ${index}`,
        description: 'JavaScript',
        phone: '888888',
        latitude: -27.8143599,
        longitude: -50.3172257,
      })
    }

    const { gyms } = await searchGymsUseCase.execute({
      search: 'JavaScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript 21' }),
      expect.objectContaining({ title: 'JavaScript 22' }),
    ])
  })
})
