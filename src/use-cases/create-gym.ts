import { GymsRepository } from '@/repositories/gyms-repository'

interface IRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({ description, latitude, longitude, phone, title }: IRequest) {
    const gym = await this.gymsRepository.create({
      description,
      latitude,
      longitude,
      phone,
      title,
    })

    return { gym }
  }
}
