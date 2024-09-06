import { Ride, RideConstructorProps, RideProps } from '../ride';
import { Coordinate } from '../value-objects.ts/coordinate';
import { AccountID } from '@/domain/account/account';
import { RideStatus } from '../ride-status';
import { faker } from '@faker-js/faker';

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
});
