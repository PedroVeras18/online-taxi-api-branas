import { Ride } from '@/domain/ride/ride';
import { RideRepository } from '@/domain/ride/ride-repository';
import { RideStatus } from '@/domain/ride/ride-status';

export class InMemoryRideRepository implements RideRepository {
  public items: Ride[] = [];

  async findById(anId: string): Promise<Ride> {
    const ride = this.items.find((user) => user.id.toString() === anId);

    if (!ride) {
      return null;
    }

    return ride;
  }

  async create(record: Ride): Promise<void> {
    this.items.push(record);
  }

  async update(record: Ride): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === record.id);

    this.items[itemIndex] = record;
  }

  async delete(anId: string): Promise<void> {
    const filteredRides = this.items.filter(
      (ride) => ride.id.toString() !== anId,
    );

    this.items = filteredRides;
  }

  async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
    const activeStatuses = new Set([
      RideStatus.REQUESTED,
      RideStatus.ACCEPTED,
      RideStatus.IN_PROGRESS
    ]);

    return this.items.some((ride) =>
      ride.passengerId.toString() === passengerId && activeStatuses.has(ride.status)
    );
  }

  async hasActiveRideByDriverId(driverId: string): Promise<boolean> {
    const activeStatuses = new Set([
      RideStatus.ACCEPTED,
      RideStatus.IN_PROGRESS
    ]);

    return this.items.some((ride) =>
      ride.driverId?.toString() === driverId && activeStatuses.has(ride.status)
    );
  }
}
