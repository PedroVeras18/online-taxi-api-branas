import { Ride, RideConstructorProps, RideProps } from '../ride';
import { Coordinate } from '../value-objects.ts/coordinate';
import { Account, AccountID } from '@/domain/account/account';
import { RideStatus } from '../ride-status';
import { faker } from '@faker-js/faker';
import { Notification } from '@/core/validation/notification';

describe('Ride Aggregate', () => {
  let mockCoordinateFrom: Coordinate;
  let mockCoordinateTo: Coordinate;
  let mockPassengerId: AccountID;
  let rideProps: RideConstructorProps;
  let ride: Ride;

  beforeEach(() => {
    mockCoordinateFrom = new Coordinate({
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    });
    mockCoordinateTo = new Coordinate({
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    });

    mockPassengerId = new AccountID();

    rideProps = {
      from: mockCoordinateFrom,
      to: mockCoordinateTo,
      passengerId: mockPassengerId,
    };

    ride = Ride.create(rideProps);
  });

  it('should create a Ride with default status, distance, and fare', () => {
    expect(ride).toBeInstanceOf(Ride);
    expect(ride.status).toBe(RideStatus.REQUESTED);
    expect(ride.distance).toBe(0);
    expect(ride.fare).toBe(0);
    expect(ride.createdAt).toBeDefined();
  });

  it('should return the correct coordinates for from and to', () => {
    expect(ride.from).toBe(mockCoordinateFrom);
    expect(ride.to).toBe(mockCoordinateTo);
  });

  it('should accept a ride', () => {
    const notification = Notification.create()

    const account = Account.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric({
        length: 8,
      }),
      cpf: faker.string.numeric({
        length: 11,
      }),
      isDriver: true
    })

    const ride = Ride.create({
      from: mockCoordinateFrom,
      to: mockCoordinateTo,
      passengerId: account.id,
    })

    ride.accept(
      account,
      notification
    )

    expect(ride.status).toBe(RideStatus.ACCEPTED)
  })

  test('should add an error if the account is not a driver', () => {
    const notification = Notification.create()

    const account = Account.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric({
        length: 8,
      }),
      cpf: faker.string.numeric({
        length: 11,
      }),
      isDriver: false
    })

    ride.accept(account, notification);

    expect(notification.hasErrors()).toBe(true)
  });

  test('should add an error if the ride status is not requested', () => {
    const notification = Notification.create()

    const account = Account.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric({
        length: 8,
      }),
      cpf: faker.string.numeric({
        length: 11,
      }),
      isDriver: false
    })

    const ride = Ride.create({
      from: mockCoordinateFrom,
      to: mockCoordinateTo,
      passengerId: account.id,
      status: RideStatus.ACCEPTED
    })

    ride.accept(account, notification);

    expect(notification.hasErrors()).toBe(true)
  });
});
