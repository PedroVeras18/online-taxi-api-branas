import ResourceNotFoundException from '@/core/exception/not-found-exception';
import NotificationException from '@/core/exception/notification-exception';
import { Notification } from '@/core/validation/notification';
import { AccountID } from '@/domain/account/account';
import { AccountRepository } from '@/domain/account/account-repository';
import { Ride } from '@/domain/ride/ride';
import { RideRepository } from '@/domain/ride/ride-repository';
import { Coordinate } from '@/domain/ride/value-objects.ts/coordinate';

export interface CoordinateProps {
  latitude: number;
  longitude: number;
}

export interface RequestRideUseCaseRequest {
  passengerId: string;
  from: CoordinateProps;
  to: CoordinateProps;
}

export interface RequestRideUseCaseResponse {
  rideId: string;
}

export class RequestRideUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private rideRepository: RideRepository,
  ) { }

  async execute(props: RequestRideUseCaseRequest): Promise<RequestRideUseCaseResponse> {
    const notification = Notification.create();

    const passenger = await this.accountRepository.findById(props.passengerId)

    if (!passenger) {
      throw ResourceNotFoundException.with('Passageiro', new AccountID(props.passengerId))
    }

    const hasActiveRide = await this.rideRepository.hasActiveRideByPassengerId(props.passengerId)

    if (hasActiveRide) {
      throw new NotificationException(
        'Erro ao solicitar corrida. Você possui corridas pendentes!',
        notification
      )
    }

    const from = Coordinate.create(props.from)
    const to = Coordinate.create(props.to)

    const ride = Ride.create({
      passengerId: new AccountID(props.passengerId),
      from,
      to,
    })

    await this.rideRepository.create(ride);

    return {
      rideId: ride.id.getValue()
    };
  }
}
