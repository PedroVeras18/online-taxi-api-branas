import { AccountID } from "@/domain/account/account"
import { AccountRepository } from "@/domain/account/account-repository"
import ResourceNotFoundException from "@/core/exception/not-found-exception"

export interface DeleteAccountUseCaseRequest {
  userId: string
}

export class DeleteAccountUseCase {
  constructor(private accountRepository: AccountRepository) { }

  async execute({ userId }: DeleteAccountUseCaseRequest): Promise<void> {
    const account = await this.accountRepository.findById(userId)

    if (!account) {
      throw ResourceNotFoundException.with('Usuário', new AccountID(userId));
    }

    account.deleteAccount()

    await this.accountRepository.update(account)
  }
}