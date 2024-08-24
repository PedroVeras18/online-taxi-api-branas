import { Repository } from '@/core/repository';
import { Account } from './account';
import { Pagination, PaginationProps } from '@/core/pagination/pagination';

export abstract class AccountRepository extends Repository<Account> {
  abstract findAll(
    params: PaginationProps<Account>,
  ): Promise<Pagination<Account>>;

  abstract findByEmail(email: string): Promise<Account | null>;
}
