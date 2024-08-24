import { Injectable } from '@nestjs/common'
import { AccountID } from '@/domain/account/account'
import { GetAccountOutput } from './get-account-output'
import { AccountRepository } from '@/domain/account/account-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'

interface GetAccountUseCaseRequest {
  userId: string
}

type GetAccountUseCaseResponse = GetAccountOutput

@Injectable()
export class GetAccountUseCase {
  constructor(
    private accountRepository: AccountRepository,
  ) { }

  async execute({
    userId,
  }: GetAccountUseCaseRequest): Promise<GetAccountUseCaseResponse> {
    const account = await this.accountRepository.findById(userId)

    if (!account) {
      throw ResourceNotFoundException.with('Usuário', new AccountID(userId));
    }

    return GetAccountOutput.fromAggregate(
      account
    )
  }
}
