import { UniqueEntityID } from '@/core/unique-entity-id';
import { AggregateRoot } from '@/core/aggregate-root';
import Cpf from '../value-objects/cpf';
import Name from '../value-objects/name';
import Email from '../value-objects/email';
import CarPlate from '../value-objects/car-plate';
import Password from '../value-objects/password';
import { DomainProps } from '@/core/domain-props';
import { ValidationHandler } from '@/core/validation/validation-handler';
import { AccountValidator } from './account-validator';

export interface AccountProps extends DomainProps {
  cpf: Cpf;
  name: Name;
  email: Email;
  password: Password;
  carPlate?: CarPlate;
  isPassenger?: boolean;
  isDriver?: boolean;
}

export class AccountID extends UniqueEntityID {}

export class Account extends AggregateRoot<AccountProps> {
  static create(aProps: AccountProps, anId?: AccountID) {
    const defaultProps = {
      createdAt: new Date(),
    };

    return new Account({ ...defaultProps, ...aProps }, anId ?? new AccountID());
  }

  public update(props: Partial<AccountProps>): void {
    Object.assign(this.props, { ...props, updatedAt: new Date() });
  }

  validate(aHandler: ValidationHandler, context: string = 'account'): void {
    new AccountValidator(this, aHandler, context).validate();
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
