import { faker } from '@faker-js/faker';

import { FactoryProp } from '.';
import { Ride, RideID, RideProps } from '@/domain/ride/ride';
import { Coordinate } from '@/domain/ride/value-objects.ts/coordinate';
import { makeUser } from './make-user';

export async function makeRide({
  repository,
  override,
}: FactoryProp<
RideProps,
  Partial<
  RideProps & {
      id: string;
    }
  >
> = {}): Promise<Ride> {
  const account = await makeUser()

  const ride = Ride.create(
    {
      from: new Coordinate({
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      }),
      to: new Coordinate({
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      }),
      passengerId: account.id,
      ...override,
    },
    new RideID(override?.id),
  );

  if (repository) {
    await repository.create(ride);
  }

  return ride;
}
