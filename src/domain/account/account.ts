import { UniqueEntityID } from '@/core/unique-entity-id';
import { AggregateRoot } from '@/core/aggregate-root';
import { DomainProps } from '@/core/domain-props';
import { Optional } from '@/core/optional';
import { ValidationHandler } from '@/core/validation/validation-handler';
import Error from '@/core/validation/error';

export interface AccountProps extends DomainProps {
  cpf: string;
  name: string;
  email: string;
  password: string;
  carPlate?: string;
  isPassenger?: boolean;
  isDriver?: boolean;
}

export class AccountID extends UniqueEntityID { }
export class Account extends AggregateRoot<AccountProps> {
  static create(
    props: Optional<AccountProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const account = new Account(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    );

    return account;
  }

  public validateUpdate(props: Partial<AccountProps>, notification: ValidationHandler) {
    if (props.isPassenger && props.carPlate) {
      notification.appendAnError(
        new Error('Passageiros não podem ter uma placa de carro registrada.')
      )
    }

    if (props.isDriver && props.isPassenger) {
      notification.appendAnError(
        new Error('Um usuário não pode ser designado como motorista e passageiro ao mesmo tempo.')
      )
    }

    if (!props.isDriver && !props.isPassenger) {
      notification.appendAnError(
        new Error('É necessário selecionar se o usuário é motorista ou passageiro.')
      )
    }

    if (props.isDriver && !props.carPlate) {
      notification.appendAnError(
        new Error('Motoristas devem informar a placa do carro.')
      )
    }
  }

  public update(props: Partial<AccountProps>): void {
    Object.assign(this.props, { ...props, updatedAt: new Date() });
  }

  get name() {
    return this.props.name;
  }

  get cpf() {
    return this.props.cpf;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get carPlate() {
    return this.props.carPlate;
  }

  get isPassenger() {
    return this.props.isPassenger;
  }

  get isDriver() {
    return this.props.isDriver;
  }
}
