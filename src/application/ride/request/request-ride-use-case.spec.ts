import { AccountRepository } from '@/domain/account/account-repository';
import { InMemoryAccountRepository } from '@test/repositories/in-memory-account-repository';
import { RideRepository } from '@/domain/ride/ride-repository';
import { CoordinateProps, RequestRideUseCase } from './request-ride-use-case';
import { InMemoryRideRepository } from '@test/repositories/in-memory-ride-repository';
import { makeUser } from '@test/factories/make-user';
import { faker } from '@faker-js/faker';
import { RideStatus } from '@/domain/ride/ride-status';

let accountRepository: AccountRepository;
let rideRepository: RideRepository;

let useCase: RequestRideUseCase;

describe('Request Ride Use case', () => {
  beforeEach(() => {
    accountRepository = new InMemoryAccountRepository();
    rideRepository = new InMemoryRideRepository();

    useCase = new RequestRideUseCase(
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

  it('should be able to request a ride', async () => {
    const user = await makeUser({
      repository: accountRepository,
    })

    const fakeCoordinates: CoordinateProps = {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    }

    const result = await useCase.execute({
      from: fakeCoordinates,
      to: fakeCoordinates,
      passengerId: user.id.toString()
    });

    const rideOnDatabase = await rideRepository.findById(result.rideId);

    expect(result.rideId).toBeDefined();
    expect(rideOnDatabase).toBeDefined();
    expect(rideOnDatabase.distance).toBe(0)
    expect(rideOnDatabase.fare).toBe(0)
    expect(rideOnDatabase.status).toBe(RideStatus.REQUESTED)
    expect(rideOnDatabase.passengerId.toString()).toBe(user.id.toString())
  });

  it('should not be able to request a ride if the passenger does not exist.', async () => {
    const fakePassengerId = 'fake-passenger-id'

    const fakeCoordinates: CoordinateProps = {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    }

    await expect(useCase.execute({
      from: fakeCoordinates,
      to: fakeCoordinates,
      passengerId: fakePassengerId,
    }))
      .rejects.toThrowError(`Passageiro com ID ${fakePassengerId} não foi encontrado`);
  })

  it('should not be able to request a ride if the passenger has active rides.', async () => {
    const user = await makeUser({
      repository: accountRepository,
    })

    const passengerId = user.id.toString()

    const fakeCoordinates: CoordinateProps = {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    }

    const firstRide = await useCase.execute({
      from: fakeCoordinates,
      to: fakeCoordinates,
      passengerId,
    });

    expect(firstRide.rideId).toBeDefined();

    await expect(useCase.execute({
      from: fakeCoordinates,
      to: fakeCoordinates,
      passengerId,
    }))
      .rejects.toThrowError(`Erro ao solicitar corrida. Você possui corridas pendentes!`);
  })
});
