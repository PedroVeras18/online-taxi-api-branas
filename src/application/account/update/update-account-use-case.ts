import ResourceNotFoundException from "@/core/exception/not-found-exception"
import NotificationException from "@/core/exception/notification-exception"
import { Notification } from "@/core/validation/notification"
import { AccountID } from "@/domain/account/account"
import { AccountRepository } from "@/domain/account/account-repository"

export interface UpdateAccountUseCaseRequest {
  id: string
  name?: string
  email?: string
  cpf?: string
  carPlate?: string
  isPassenger?: boolean;
  isDriver?: boolean;
}

export class UpdateAccountUseCase {
  constructor(private accountRepository: AccountRepository) { }

  async execute(anInput: UpdateAccountUseCaseRequest): Promise<void> {
    const notification = Notification.create()

    const account = await this.accountRepository.findById(anInput.id)

    if (!account) {
      throw ResourceNotFoundException.with('Usuário', new AccountID(anInput.id));
    }

    account.update(anInput)

    account.validateUpdate(account, notification)

    if (notification.hasErrors()) {
      throw new NotificationException(
        "Não foi possível atualizar a conta.",
        notification,
      );
    }

    await this.accountRepository.update(account)
  }
}