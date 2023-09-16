import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CheckInUseCase } from '@/use-cases/check-in'
import { MaxDistanceError } from '@/use-cases/errors/max-distance-error'
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins-error'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      description: '',
      phone: '',
      title: '',
      latitude: new Decimal(-27.8143599),
      longitude: new Decimal(-50.3172257),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able a create new check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.8143599,
      userLongitude: -50.3172257,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 8, 14, 8, 0, 0))

    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.8143599,
      userLongitude: -50.3172257,
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -27.8143599,
        userLongitude: -50.3172257,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2022, 8, 14, 8, 0, 0))

    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.8143599,
      userLongitude: -50.3172257,
    })

    vi.setSystemTime(new Date(2022, 8, 15, 8, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.8143599,
      userLongitude: -50.3172257,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able a create new check in on distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-02',
      description: '',
      phone: '',
      title: '',
      latitude: new Decimal(-27.1143599),
      longitude: new Decimal(-50.1172257),
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -27.8143599,
        userLongitude: -50.3172257,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
