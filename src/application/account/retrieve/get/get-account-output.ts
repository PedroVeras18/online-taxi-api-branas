import { Account, AccountProps } from '@/domain/account/account';

export class GetAccountOutput {
  id: string
  name: string
  email: string
  cpf: string
  carPlate?: string
  isPassenger?: boolean;
  isDriver?: boolean;

  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null

  constructor(
    aAccountProps: AccountProps & { id: string },
  ) {
    this.id = aAccountProps.id.toString();
    this.name = aAccountProps.name;
    this.email = aAccountProps.email;
    this.cpf = aAccountProps.cpf;
    this.carPlate = aAccountProps.carPlate ?? undefined;
    this.isPassenger = aAccountProps.isPassenger ?? undefined;
    this.isDriver = aAccountProps.isDriver ?? undefined;

    this.createdAt = aAccountProps.createdAt;
    this.updatedAt = aAccountProps.updatedAt ?? undefined;
    this.deletedAt = aAccountProps.deletedAt ?? undefined;
  }

  static fromAggregate(
    account: Account,
  ) {

    return new GetAccountOutput(
      account.toJSON(),
    );
  }
}
