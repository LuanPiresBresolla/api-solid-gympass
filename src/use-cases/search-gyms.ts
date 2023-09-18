import { GymsRepository } from '@/repositories/gyms-repository'

interface IRequest {
  search: string
  page: number
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({ search, page }: IRequest) {
    const gyms = await this.gymsRepository.searchMany(search, page)

    return { gyms }
  }
}
