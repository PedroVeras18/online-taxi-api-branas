import { Repository } from '@/core/repository';
import { Ride } from './ride';

export abstract class RideRepository extends Repository<Ride> {
  abstract hasActiveRideByPassengerId(passengerId: string): Promise<boolean>;
}
