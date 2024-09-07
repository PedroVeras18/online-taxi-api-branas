import ResourceNotFoundException from '@/core/exception/not-found-exception';
import NotificationException from '@/core/exception/notification-exception';
import { Notification } from '@/core/validation/notification';
import { AccountID } from '@/domain/account/account';
import { AccountRepository } from '@/domain/account/account-repository';
import { RideRepository } from '@/domain/ride/ride-repository';

export interface AcceptRideUseCaseRequest {
  rideId: string;
  driverId: string;
}

export class AcceptRideUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private rideRepository: RideRepository,
  ) { }

  async execute(props: AcceptRideUseCaseRequest): Promise<void> {
    const notification = Notification.create();

    const driver = await this.getDriver(props.driverId);
    const ride = await this.getRide(props.rideId);

    const hasActiveRide = await this.rideRepository.hasActiveRideByDriverId(props.driverId)

    if (hasActiveRide) {
      throw new NotificationException(
        "O motorista já possui uma corrida ativa.",
        notification,
      );
    }

    ride.accept(driver, notification)

    if (notification.hasErrors()) {
      throw new NotificationException(
        "Não foi possível aceitar a corrida.",
        notification,
      );
    }

    await this.rideRepository.update(ride)
  }


  private async getDriver(driverId: string) {
    const driver = await this.accountRepository.findById(driverId);
    if (!driver) {
      throw ResourceNotFoundException.with('Motorista', new AccountID(driverId))
    }
    return driver;
  }

  private async getRide(rideId: string) {
    const ride = await this.rideRepository.findById(rideId);
    if (!ride) {
      throw ResourceNotFoundException.with('Corrida', new AccountID(rideId))
    }
    return ride;
  }
}
