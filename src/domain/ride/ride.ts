import { UniqueEntityID } from '@/core/unique-entity-id';
import { AggregateRoot } from '@/core/aggregate-root';
import { DomainProps } from '@/core/domain-props';
import { Coordinate } from './value-objects.ts/coordinate';
import { Account, AccountID } from '../account/account';
import { RideStatus } from './ride-status';
import { Replace } from '@/core/replace';
import { ValidationHandler } from '@/core/validation/validation-handler';

export interface RideProps extends DomainProps {
  from: Coordinate;
  to: Coordinate;
  passengerId: AccountID;
  status: RideStatus;
  distance: number;
  fare: number;
  driverId?: AccountID;
}

export class RideID extends UniqueEntityID { }

export type RideConstructorProps = Replace<
  RideProps,
  {
    status?: RideStatus;
    distance?: number;
    fare?: number;
  }
>

export class Ride extends AggregateRoot<RideProps> {
  static create(
    props: RideConstructorProps,
    id?: RideID,
  ) {
    const ride = new Ride(
      {
        ...props,
        status: RideStatus.REQUESTED,
        distance: 0,
        fare: 0,
        createdAt: new Date(),
      },
      id,
    );

    return ride;
  }

  public accept(driverAccount: Account, notification: ValidationHandler) {
    if (!driverAccount.isDriver) {
      notification.appendAnError(
        new Error('Esta conta não é de um motorista.')
      )
    }

    if (this.status !== RideStatus.REQUESTED) {
      notification.appendAnError(
        new Error('A corrida precisa estar com status Solicitada.')
      )
    }

    this.props.driverId = driverAccount.id;
    this.props.status = RideStatus.ACCEPTED
  }

  get from() {
    return this.props.from;
  }

  get to() {
    return this.props.to;
  }

  get passengerId() {
    return this.props.passengerId;
  }

  get status() {
    return this.props.status;
  }

  get distance() {
    return this.props.distance;
  }

  get fare() {
    return this.props.fare;
  }

  get driverId() {
    return this.props.driverId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }
}
