import { UniqueEntityID } from '@/core/unique-entity-id';
import { AggregateRoot } from '@/core/aggregate-root';
import { DomainProps } from '@/core/domain-props';
import { Coordinate } from './value-objects.ts/coordinate';
import { AccountID } from '../account/account';
import { RideStatus } from './ride-status';
import { Replace } from '@/core/replace';

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
