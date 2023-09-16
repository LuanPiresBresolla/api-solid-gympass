import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface IRequest {
  userId: string
  page: number
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({ userId, page }: IRequest) {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return { checkIns }
  }
}
