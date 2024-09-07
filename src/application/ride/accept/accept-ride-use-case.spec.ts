import { AccountRepository } from '@/domain/account/account-repository';
import { InMemoryAccountRepository } from '@test/repositories/in-memory-account-repository';
import { RideRepository } from '@/domain/ride/ride-repository';
import { AcceptRideUseCase } from './accept-ride-use-case';
import { InMemoryRideRepository } from '@test/repositories/in-memory-ride-repository';
import { makeUser } from '@test/factories/make-user';
import { RideStatus } from '@/domain/ride/ride-status';
import { makeRide } from '@test/factories/make-ride';

let accountRepository: AccountRepository;
let rideRepository: RideRepository;

let useCase: AcceptRideUseCase;

describe('Accept Ride Use case', () => {
  beforeEach(() => {
    accountRepository = new InMemoryAccountRepository();
    rideRepository = new InMemoryRideRepository();

    useCase = new AcceptRideUseCase(
      accountRepository,
      rideRepository
    );
  });

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined();

    expect(accountRepository).toBeDefined();
    expect(rideRepository).toBeDefined();
    expect(useCase).toBeDefined();
  });

  it('should be able to accept a ride', async () => {
    const driver = await makeUser({
      override: {
        isDriver: true,
        isPassenger: false,
      },
      repository: accountRepository,
    })

    const ride = await makeRide({
      repository: rideRepository,
    })

    await useCase.execute({
      driverId: driver.id.toString(),
      rideId: ride.id.toString(),
    });

    const rideOnDatabase = await rideRepository.findById(ride.id.toString());

    expect(rideOnDatabase).toBeDefined();
    expect(rideOnDatabase.driverId).toBe(driver.id)
    expect(rideOnDatabase.status).toBe(RideStatus.ACCEPTED)
    expect(rideOnDatabase.passengerId).toBe(ride.passengerId)
  });

  it('should not be able driver has active ride.', async () => {
    const driver = await makeUser({
      override: {
        isDriver: true,
        isPassenger: false,
      },
      repository: accountRepository,
    })

    const ride = await makeRide({
      repository: rideRepository,
    })

    await useCase.execute({
      driverId: driver.id.toString(),
      rideId: ride.id.toString(),
    });

    await expect(useCase.execute({
      driverId: driver.id.toString(),
      rideId: ride.id.toString(),
    }))
      .rejects.toThrowError(`O motorista já possui uma corrida ativa.`);
  })
});
