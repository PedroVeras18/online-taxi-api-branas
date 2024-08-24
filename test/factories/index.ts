import { Repository } from '@/core/repository';

export type FactoryProp<T, O> = {
  repository?: Repository<T>;
  override?: O;
};
