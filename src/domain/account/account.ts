import { UniqueEntityID } from '@/core/unique-entity-id';
import { AggregateRoot } from '@/core/aggregate-root';
import { DomainProps } from '@/core/domain-props';
import { ValidationHandler } from '@/core/validation/validation-handler';
import { AccountValidator } from './account-validator';
import { Optional } from '@/core/optional';

export interface AccountProps extends DomainProps {
  cpf: string;
  name: string;
  email: string;
  password: string;
  carPlate?: string;
  isPassenger?: boolean;
  isDriver?: boolean;
}

export class AccountID extends UniqueEntityID {}
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

  public update(props: Partial<AccountProps>): void {
    Object.assign(this.props, { ...props, updatedAt: new Date() });
  }

  /* validate(aHandler: ValidationHandler, context: string = 'account'): void {
    new AccountValidator(this, aHandler, context).validate();
  } */

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
