import NotificationException from '@/core/exception/notification-exception';
import { Notification } from '@/core/validation/notification';
import { Account } from '@/domain/account/account';
import { AccountRepository } from '@/domain/account/account-repository';
import { HashGenerator } from '@/domain/cryptography/hash-generator';

export interface CreateAccountRequest {
  name: string;
  cpf: string;
  email: string;
  password: string;
  carPlate?: string;
  isPassenger?: boolean;
  isDriver?: boolean;
}

export interface CreateAccountResponse {
  accountId: string;
}

export class CreateAccountUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(props: CreateAccountRequest): Promise<CreateAccountResponse> {
    const notification = Notification.create();

    await this.validateAccountCreation(props, notification);

    if (notification.hasErrors()) {
      throw new NotificationException(
        "Não foi possível criar a conta.",
        notification,
      );
    }

    const hashedPassword = await this.hashGenerator.hash(props.password);

    const createdAccount = Account.create({
      ...props,
      password: hashedPassword,
    });

    await this.accountRepository.create(createdAccount);

    return {
      accountId: createdAccount.id.getValue(),
    };
  }

  private async validateAccountCreation(
    props: CreateAccountRequest,
    notification: Notification
  ): Promise<void> {
    const userWithSameEmail = await this.accountRepository.findByEmail(
      props.email,
    );

    if (userWithSameEmail) {
      notification.appendAnError(new Error(`${props.email} já está cadastrado no sistema.`));
    }

    if (props.isPassenger && props.carPlate) {
      notification.appendAnError(new Error("Passageiros não podem ter uma placa de carro registrada."));
    }
  }
}
