import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface IRequest {
  userId: string
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({ userId }: IRequest) {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return { checkInsCount }
  }
}
